from django.db import models
from django.contrib.auth.models import User
# Create your models here.
import os
from uuid import uuid4
def path_and_rename_profile(instance, filename):
    upload_to = 'profiles'
    ext = filename.split('.')[-1]
    # get filename
    if instance.user.id:
        filename = '{}.{}'.format(instance.user.id, ext)
    else:
        # set filename as random string
        filename = '{}.{}'.format(uuid4().hex, ext)
    # return the whole path to the file
    return os.path.join(upload_to, filename)
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(default='avatar.png', upload_to=path_and_rename_profile, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}"
