from django.contrib import admin
from .models import Post, Comment, Like, Photo

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Photo)
# Register your models here.
