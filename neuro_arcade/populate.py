#!/usr/bin/env python

"""
Populate the database with example data
"""

"""
Setup django
"""

import os
from shutil import copy

from neuro_arcade.settings import MEDIA_ROOT, STATIC_DIR
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuro_arcade.settings')

import django
django.setup()

"""
Main program
"""

from typing import Dict

from django.contrib.auth.models import User 
from django.templatetags.static import static

from na.models import GameTag, Game, Player, PlayerTag, Score

users = [
    {
        'username': "User1",
        'email': "user1@email.com",
    },
    {
        'username': "User2",
        'email': "user2@email.com",
    },
    {
        'username': "User3",
        'email': "user3@email.com",
    },
]

game_tags = [
    {
        'name': "Tag 1",
        'description': "It's Tag 1",
    },
    {
        'name': "Tag 2",
        'description': "It's Tag 2",
    },
    {
        'name': "Tag 3",
        'description': "It's Tag 3",
    },
]

games = [
    {
        'name': "Game 1",
        'description': "It's Game 1.",
        'owner': "User1",
        'icon': "example.png",
        'tags': ["Tag 1", "Tag 2"],
        'score_type': "{points: {max: 100, type: int}, coins: {max: 10, type: int}}"
    },
    {
        'name': "Game 2",
        'description': "It's Game 2.",
        'owner': "User2",
        'icon': "example.png",
        'tags': ["Tag 2", "Tag 3"],
        'score_type': "{score: {max: 20, type: int}}"
    },
    {
        'name': "Game 3",
        'description': "It's Game 3.",
        'owner': "User3",
        'icon': "example.png",
        'tags': ["Tag 3"],
        'score_type': "{score: {max: 100.0, type: float}}"
    },
]

players = [
    {
        'name': 'Human Player 1',
        'is_ai': 0,
        'user': 'User1',
        'description': 'human player that is owned by User1',
        'player_tags': [],  # TODO populate player tags
    },
    {
        'name': 'Human Player 2',
        'is_ai': 0,
        'user': 'User2',
        'description': 'human player that is owned by User2',
        'player_tags': [],
    },
    {
        'name': 'AI Player 1',
        'is_ai': 1,
        'user': 'User3',
        'description': 'first AI player that is owned by User3',
        'player_tags': [],
    },
    {
        'name': 'AI Player 2',
        'is_ai': 1,
        'user': 'User3',
        'description': 'second AI player that is owned by User3',
        'player_tags': [],
    },
]

scores = [
    {
        'values': "{points: 90, coins:10}",
        'player': "Player1",
        'game': 'Game 1',
    },
    {
        'values': "{points: 75, coins:2}",
        'player': "Player2",
        'game': 'Game 1',
    },
    {
        'values': "{score: 9}",
        'player': "Player3",
        'game': 'Game 2',
    },
    {
        'values': "{score: 50.5}",
        'player': "Player3",
        'game': 'Game 3',
    },
]

def add_media_from_static(folder: str, filename: str) -> str:
    """Copies a file from /static/population/ to /media/"""

    # Build paths
    src = os.path.join(STATIC_DIR, 'population', folder, filename)
    dest_folder = os.path.join(MEDIA_ROOT, folder)

    # Make folders if needed
    os.makedirs(dest_folder, exist_ok=True)

    # Copy file to media
    copy(
        src,
        dest_folder
    )

    # Return relative path
    return os.path.join(folder, filename)


def add_user(data: Dict) -> User:
    """Create a django user"""

    user = User.objects.get_or_create(username=data['username'])[0]
    user.email = data['email']
    user.set_password(user.username)
    user.save()

    return user


def add_game_tag(data: Dict) -> GameTag:
    """Create n na game tag"""

    tag = GameTag.objects.get_or_create(name=data['name'])[0]
    tag.description = data.get('description', "")
    tag.save()

    return tag


def add_game(data: Dict) -> Game:
    """Create a na game"""

    game = Game.objects.get_or_create(
        name=data['name'],
        defaults={
            'owner': User.objects.get(username=data['owner']),
        },
    )[0]
    game.description = data.get('description', "no description")

    if 'icon' in data:
        game.icon.name = add_media_from_static(Game.MEDIA_SUBDIR, data['icon'])

    for tag_name in data.get('tags', []):
        tag = GameTag.objects.get(name=tag_name)
        game.tags.add(tag)

    game.score_type = data.get('score_type', "{}")

    game.save()

    return game


def add_player(data: Dict):
    player = Player.objects.get_or_create(name=data['name'])[0]
    player.is_ai = data['is_ai']
    player.user = User.objects.get(username=data['user'])
    player.description = data['description']

    for tag_name in data.get('player_tags', []):
        tag = PlayerTag.objects.get(name=tag_name)
        player.player_tags.add(tag)

    player.save()

    return player


def add_score(data: Dict):
    player = Player.objects.get(name=data['player'])
    game = Game.objects.get(name=data['game'])
    score = Score.objects.get_or_create(player_id=player.id, game_id=game.id)[0]
    score.values = data['values']


# TODO: PlayerTag


def populate():
    """Populate the database with example data"""

    for data in users:
        add_user(data)
    for data in game_tags:
        add_game_tag(data)
    for data in games:
        add_game(data)
    for data in players:
        add_player(data)
    for data in scores:
        add_score(data)


if __name__ == "__main__":
    populate()
