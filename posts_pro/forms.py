from django import forms
from .models import Post

class CreatePost(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('title', 'description')
        #exclude = ['created_at', 'last_update', 'author', 'likes']
        wigets = {
            "title": forms.TextInput(attrs={"class": "form-control", "required": True, "type": "text", "name": "title", "placeholder":"Title", "maxlength": 200}),
            "description": forms.Textarea(attrs={"class": "form-control", "required": True, "type": "text", "name": "description", "placeholder":"Description", "maxlength": 1200}),
        }