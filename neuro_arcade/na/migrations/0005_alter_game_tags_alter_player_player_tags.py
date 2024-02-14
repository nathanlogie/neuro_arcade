# Generated by Django 4.2.6 on 2023-12-30 19:23

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("na", "0004_game_evaluation_script"),
    ]

    operations = [
        migrations.AlterField(
            model_name="game",
            name="tags",
            field=models.ManyToManyField(blank=True, to="na.gametag"),
        ),
        migrations.AlterField(
            model_name="player",
            name="player_tags",
            field=models.ManyToManyField(blank=True, to="na.playertag"),
        ),
    ]
