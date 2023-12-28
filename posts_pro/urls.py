from django.urls import path
from . import views

app_name = 'posts-pro'

urlpatterns = [
    path('', views.index, name='main'),
    path('posts/<int:number>/', views.load_data, name='main-broad'),
    path('like-post/<int:id>/', views.like_post, name='like'),
    path('unlike-post/<int:id>/', views.unlike_post, name='unlike'),
    path('null-post/<int:id>/', views.null_post, name='null'),
    path('<int:id>/', views.post_detail, name='post-detail'),
    path('get-card-data/<int:id>/', views.get_card_data, name='get-card-data'),
    path('update-post/<int:id>/', views.update, name='update'),
    path('delete-post/<int:id>/', views.delete, name='delete'),
    path('upload/<int:id>/', views.upload, name='upload'),
    path('img_url/<int:id>/', views.upload, name='img_url'),
]