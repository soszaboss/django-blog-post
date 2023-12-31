# Generated by Django 4.2.6 on 2023-11-13 11:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0006_alter_profile_avatar'),
        ('posts_pro', '0005_remove_post_like_counts_remove_post_unlike_counts_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='post',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterField(
            model_name='post',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='profiles.profile'),
        ),
    ]
