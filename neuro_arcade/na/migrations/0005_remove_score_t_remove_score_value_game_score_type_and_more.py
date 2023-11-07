# Generated by Django 4.2.6 on 2023-11-07 12:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('na', '0004_gametag_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='score',
            name='t',
        ),
        migrations.RemoveField(
            model_name='score',
            name='value',
        ),
        migrations.AddField(
            model_name='game',
            name='score_type',
            field=models.CharField(default=None, max_length=256),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='score',
            name='game',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='na.game'),
        ),
        migrations.AddField(
            model_name='score',
            name='values',
            field=models.CharField(default=None, max_length=256),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='score',
            name='player',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='na.player'),
        ),
        migrations.DeleteModel(
            name='ScoreType',
        ),
    ]
