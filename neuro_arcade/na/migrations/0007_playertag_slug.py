# Part 1 of a manual migration - allow SlugField to be non-unique for now

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("na", "0006_game_priority"),
    ]

    operations = [
        migrations.AddField(
            model_name="playertag",
            name="slug",
            field=models.SlugField(default=""),
        ),
    ]
