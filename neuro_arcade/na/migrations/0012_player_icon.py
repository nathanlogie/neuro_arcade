# Generated by Django 4.2.9 on 2024-02-25 20:21

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("na", "0011_userstatus"),
    ]

    operations = [
        migrations.AddField(
            model_name="player",
            name="icon",
            field=models.ImageField(blank=True, upload_to="profile_pics"),
        ),
    ]
