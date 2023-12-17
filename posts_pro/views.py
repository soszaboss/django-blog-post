from django.utils import timezone
from django.shortcuts import render, get_object_or_404
from .models import Post, Comment, Like, Photo
from django.http import JsonResponse, HttpResponse
from django.db.models import Count, Q
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from .forms import CreatePost
from profiles.models import Profile
from django.http import QueryDict




def index(request):
    form = CreatePost(request.POST or None)
    # qs = Post.objects.all()
    if form.is_valid():
        author_profile = Profile.objects.get(user=request.user)
        post = form.save(commit=False)
        post.author = author_profile
        post.created_at = timezone.now()
        post.updated_at = timezone.now()
        post.save()
        # author_data = serialize('json', [author_profile])

        return JsonResponse({
            'title': post.title,
            'description': post.description,
            'author': request.user.username,  # Include serialized author data
            'id': post.id,
        })
    context = {
        'form': form,
        # 'posts': qs
    }
    return render(request, 'posts_pro/main.html', context)



from django.db.models import Count, Prefetch

def load_data(request, number):
    # Get the ContentType for the Post model
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':

        post_visible = 3
        upper = number
        lower = upper - post_visible
        size = Post.objects.all().count()

        posts = Post.objects.prefetch_related(
            Prefetch('photo_set', queryset=Photo.objects.all())
        ).annotate(
            like_counts=Count('likes', filter=Q(likes__value=True)),
            unlike_counts=Count('likes', filter=Q(likes__value=False)),
            comment_counts=Count('comments'),
            photo_counts=Count('photos')
        ).order_by('-created_at')[lower:upper]

        post_list = []
        for post_item in posts:
            post_items = {
                'id': post_item.id,
                'title': post_item.title,
                'description': post_item.description,
                'author': post_item.author.user.username,
                "liked": Like.objects.filter(content_type=ContentType.objects.get_for_model(Post), object_id=int(post_item.id), value=True, user=request.user).exists(),
                "unliked": Like.objects.filter(content_type=ContentType.objects.get_for_model(Post), object_id=int(post_item.id), value=False, user=request.user).exists(),
                "liked_count": post_item.like_counts,
                "unliked_count": post_item.unlike_counts,
                "comments_count": post_item.comment_counts,
                "photo_count": post_item.photo_counts
            }
            # Get the photos related to the current post
            photos = post_item.photo_set.all()
            photo_urls = [photo.image.url for photo in photos]

            # Add the photo URLs and the author's profile picture to the post data
            post_items['photos'] = photo_urls
            post_items['author_avatar'] = post_item.author.user.profile.avatar.url

            post_list.append(post_items)

        return JsonResponse({'post': post_list, 'size': size, 'user': request.user.username})



def like_post(request, id):
    if request.method == 'POST':
        #post = get_object_or_404(Post, id=id)
        post_content_type = ContentType.objects.get_for_model(Post)
        user_value, created = Like.objects.get_or_create(user=request.user, content_type=post_content_type, object_id=id)
        user_value.value = True
        user_value.save()
        posts = Post.objects.filter(id=id).annotate(
            like_counts=Count('likes', filter=Q(likes__value=True)),
            unlike_counts=Count('likes', filter=Q(likes__value=False)),
        ).first()
        return JsonResponse({'value': True, 'like_counts': posts.like_counts,
                             'unlike_counts': posts.unlike_counts, 'id': id})


def unlike_post(request, id):
    if request.method == 'POST' :#and request.user.is_authenticated:
        #post = get_object_or_404(Post, id=id)
        post_content_type = ContentType.objects.get_for_model(Post)
        user_value, created = Like.objects.get_or_create(user=request.user, content_type=post_content_type, object_id=id)
        user_value.value = False
        user_value.save()
        posts = Post.objects.filter(id=id).annotate(
            like_counts=Count('likes', filter=Q(likes__value=True)),
            unlike_counts=Count('likes', filter=Q(likes__value=False)),
        ).first()
        return JsonResponse({'value': False, 'like_counts': posts.like_counts,
                             'unlike_counts': posts.unlike_counts, 'id':id})

def null_post(request, id):
    if request.method == 'POST':  # and request.user.is_authenticated:
        # post = get_object_or_404(Post, id=id)
        post_content_type = ContentType.objects.get_for_model(Post)
        user_value, created = Like.objects.get_or_create(user=request.user, content_type=post_content_type,
                                                         object_id=id)
        user_value.value = None
        user_value.save()
        posts = Post.objects.filter(id=id).annotate(
            like_counts=Count('likes', filter=Q(likes__value=True)),
            unlike_counts=Count('likes', filter=Q(likes__value=False)),
        ).first()
        return JsonResponse({'value': None, 'like_counts': posts.like_counts,
                             'unlike_counts': posts.unlike_counts, 'id': id})




def get_like_data(content_type, object_id, user):
    liked = Like.objects.filter(content_type=content_type, object_id=object_id, value=True, user=user).exists()
    liked_count = Like.objects.filter(content_type=content_type, object_id=object_id, value=True).count()
    unliked_count = Like.objects.filter(content_type=content_type, object_id=object_id, value=False).count()
    return liked, liked_count, unliked_count

def post_detail(request, id):
    post_id = id
    form = CreatePost()
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        obj = get_object_or_404(Post.objects.select_related('author__user').prefetch_related('comments__replies').annotate(
            like_counts=Count('likes', filter=Q(likes__value=True)),
            unlike_counts=Count('likes', filter=Q(likes__value=False)),
            # comment_counts=Count('comments')
        ), id=post_id)
        comments_items_list = []
        all_comment = obj.comments.all()

        for comment_item in all_comment:
            liked, liked_count, unliked_count = get_like_data(ContentType.objects.get_for_model(Comment), comment_item.id, request.user)
            subcomments = [
                {"user": replies.user.username, "text": replies.text, "created_at": replies.created_at,
                 "liked": Like.objects.filter(content_type=ContentType.objects.get_for_model(Comment),
                                              object_id=replies.id, value=True, user=request.user).exists(),
                 "liked_count": Like.objects.filter(content_type=ContentType.objects.get_for_model(Comment), object_id=replies.id,
                                                    value=True).count()} for replies in
                comment_item.replies.all()]
            comments_items = {
                "id": comment_item.id,
                "text": comment_item.text,
                "created_at": comment_item.created_at,
                "user": comment_item.user.username if comment_item.user else '',
                "liked": liked,
                "liked_count": liked_count,
                "unliked_count": unliked_count,
                "subcomments": subcomments,
            }
            comments_items_list.append(comments_items)
        liked, liked_count, unliked_count = get_like_data(ContentType.objects.get_for_model(Post), post_id, request.user)
        post_items  = {
            "id": post_id,
            "title": obj.title,
            "description": obj.description,
            "author": obj.author.user.username,
            "created_at": obj.created_at,
            "liked": liked,
            "unliked": Like.objects.filter(content_type=ContentType.objects.get_for_model(Post), object_id=post_id,value=False, user=request.user).exists(),
            "liked_count": liked_count,
            "unliked_count": unliked_count,
            "comments": comments_items_list
        }
        return JsonResponse(post_items)
    context = {
        'form': form,
    }
    return render(request, 'posts_pro/detail.html', context)

def get_card_data(request, id):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' and request.method == 'GET':
        post = get_object_or_404(Post.objects.annotate(
            like_counts=Count('likes', filter=Q(likes__value=True)),
            unlike_counts=Count('likes', filter=Q(likes__value=False)),
            comment_counts=Count('comments')
        ), id=id)
        return JsonResponse({
            "id":id,
            "title":post.title,
            "description":post.description,
            "author":post.author.user.username,
            "like_counts":post.like_counts,
            "unlike_counts":post.unlike_counts,
            "comment_counts":post.comment_counts,
            "liked": Like.objects.filter(content_type=ContentType.objects.get_for_model(Post), object_id=id, value=True,
                                         user=request.user).exists(),
            "unliked": Like.objects.filter(content_type=ContentType.objects.get_for_model(Post), object_id=id, value=False,
                                           user=request.user).exists()})


def delete(request, id):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' and request.method == 'DELETE':
        delete = Post.objects.get(id=id)
        delete.delete()
        return HttpResponse(status=204)



def update(request, id):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' and request.method == 'PUT':
        current_record = get_object_or_404(Post.objects, id=id)
        put = QueryDict(request.body)
        title = put.get('title')
        description = put.get('description')
        current_record.title = title
        current_record.description = description
        current_record.updated_at = timezone.now()
        current_record.save()
        return JsonResponse({"title":title,"description":description, "id":id})
#In this code, QueryDict(request.body) creates a new QueryDict (similar to a dictionary) that contains your PUT parameters. You can then use put.get('title') and put.get('description') to access the parameters.