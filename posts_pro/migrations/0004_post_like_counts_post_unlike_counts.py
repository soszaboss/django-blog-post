# Generated by Django 4.2.6 on 2023-11-02 00:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts_pro', '0003_remove_comment_liked_remove_comment_unliked_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='like_counts',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='post',
            name='unlike_counts',
            field=models.IntegerField(default=0),
        ),
    ]
