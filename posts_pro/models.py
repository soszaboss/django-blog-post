from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.db import models
from profiles.models import Profile
from django.contrib.auth.models import User
import os
from uuid import uuid4

def path_and_rename_post(instance, filename):
    upload_to = 'posts'
    ext = filename.split('.')[-1]
    # get filename
    if instance.post.id:
        filename = '{}.{}'.format(instance.post.id, ext)
    else:
        # set filename as random string
        filename = '{}.{}'.format(uuid4().hex, ext)
    # return the whole path to the file
    return os.path.join(upload_to, filename)
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.BooleanField(default=None, null=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_query_name='like')
    object_id = models.PositiveIntegerField()
    content_object=GenericForeignKey('content_type', 'object_id')

class Post(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    author = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="posts")
    updated_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)
    likes = GenericRelation(Like)
    photos = models.ImageField(upload_to=path_and_rename_post, blank=True, null=True)

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.title}"

    class Meta:
        ordering = ['-created_at']

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField(blank=True)
    parent_comment = models.ForeignKey('self', blank=True, null=True, related_name="replies", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = GenericRelation(Like)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="comment", null=True)
    def __str__(self):
        return f"{self.user}: {self.text}"
class Photo(models.Model):
    image = models.ImageField(upload_to=path_and_rename_post)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, blank=True, null=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
