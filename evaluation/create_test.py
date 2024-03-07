
import os
import sys
import subprocess

sys.path.insert(0, '../neuro_arcade')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuro_arcade.settings')
import django
django.setup()

BACKLOG_PATH = './backlog/'

import json

from na.models import UnprocessedResults, Game, Player

for i in range(5):
    UnprocessedResults.objects.create(
        content = json.dumps(
            {
                "string 1": "abcde",
                "string 2": "1",
            }
        ),
        player = Player.objects.get(name="Billy Bennett"),
        game = Game.objects.get(name="Flying Bird")
    )

# print(UnprocessedResults.objects.all())