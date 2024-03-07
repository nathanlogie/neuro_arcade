
import os
import sys
import subprocess

sys.path.insert(0, '../neuro_arcade')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuro_arcade.settings')
import django
django.setup()

BACKLOG_PATH = './backlog/'


from na.models import UnprocessedResults, Game, Player

for i in range(60):
    UnprocessedResults.objects.create(
        content = "{}",
        player = Player.objects.get(name="Billy Bennett"),
        game = Game.objects.get(name="Flying Bird")
    )

# print(UnprocessedResults.objects.all())