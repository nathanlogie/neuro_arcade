# Generated by Django 4.2.9 on 2024-02-27 17:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('na', '0012_merge_0011_rawscore_0011_userstatus'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='RawScore',
            new_name='UnprocessedResults',
        ),
    ]
