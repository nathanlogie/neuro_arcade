# Part 3 of a manual migration - make slug unique now that it's filled in

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('na', '0008_playertag_gen_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playertag',
            name='slug',
            field=models.SlugField(unique=True),
        ),
    ]