"""
Creates dummy unprocessed results in the database

Depends on games and players from populate.py
"""

import os
import sys
import subprocess

sys.path.insert(0, '../neuro_arcade')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuro_arcade.settings')
import django
django.setup()

BACKLOG_PATH = './backlog/'

import json
import sys

from django.db.utils import OperationalError

from na.models import UnprocessedResults, Game, Player, validate_score

def create_result(content, player, game):
    # Try until database not locked
    while True:
        try:
            UnprocessedResults.objects.create(
                content=content,
                player=player,
                game=game
            )
            return
        except OperationalError:
            pass


for i in range(int(sys.argv[1])):
    UnprocessedResults.objects.create(
        content = json.dumps(
            {
                "string 1": "abcde",
                "string 2": "1",
            }
        ),
        player = Player.objects.get(name="Billy Bennett"),
        game = Game.objects.get(name="Words")
    )

# print(UnprocessedResults.objects.all())