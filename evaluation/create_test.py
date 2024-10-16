"""
Creates dummy unprocessed results in the database

Depends on games and players from populate.py
"""

# Imports need to happen in a specific order to setup django
# autopep8: off

import os
import sys

sys.path.insert(0, '../neuro_arcade')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuro_arcade.settings')
import django
django.setup()

import json

import django
from django.db.utils import OperationalError
import time
from na.models import UnprocessedResults, Game, Player, validate_score

# autopep8: on

BACKLOG_PATH = './backlog/'
LOCK_SLEEP_TIME = 1


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
            time.sleep(LOCK_SLEEP_TIME)
            continue


for i in range(int(sys.argv[1])):
    UnprocessedResults.objects.create(
        content=json.dumps(
            {
                "string 1": "abcde",
                "string 2": "1",
            }
        ),
        player=Player.objects.get(name="Billy Bennett"),
        game=Game.objects.get(name="Words")
    )

# print(UnprocessedResults.objects.all())
