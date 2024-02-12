# Part 2 of a manual migration - fill in the slugs of existing tags

from django.db import migrations
from django.template.defaultfilters import slugify

from na.models import PlayerTag


def set_slug(*args):
    for tag in PlayerTag.objects.all():
        tag.slug = slugify(tag.name)
        tag.save()


class Migration(migrations.Migration):

    dependencies = [
        ('na', '0007_playertag_slug'),
    ]

    operations = [
        migrations.RunPython(set_slug)
    ]
