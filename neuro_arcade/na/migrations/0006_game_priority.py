# Generated by Django 4.2.6 on 2024-01-12 15:11

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("na", "0005_alter_game_tags_alter_player_player_tags"),
    ]

    operations = [
        migrations.AddField(
            model_name="game",
            name="priority",
            field=models.IntegerField(default=0),
        ),
    ]
