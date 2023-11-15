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

from django.contrib.auth.models import Group, Permission, User
from django.templatetags.static import static
from django.utils import timezone
from pytz import utc

from na.models import GameTag, Game, Player, PlayerTag, ScoreRow, ScoreField, ScoreColumn, ScoreTable

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
    {
        'username': "Admin1",
        'email': "admin1@email.com",
        'groups': ["Administrator"],
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
        'is_ai': False,
        'user': 'User1',
        'description': 'human player that is owned by User1',
        'player_tags': [],  # TODO populate player tags
    },
    {
        'name': 'Human Player 2',
        'is_ai': False,
        'user': 'User2',
        'description': 'human player that is owned by User2',
        'player_tags': [],
    },
    {
        'name': 'AI Player 1',
        'is_ai': True,
        'user': 'User3',
        'description': 'first AI player that is owned by User3',
        'player_tags': [],
    },
    {
        'name': 'AI Player 2',
        'is_ai': True,
        'user': 'User3',
        'description': 'second AI player that is owned by User3',
        'player_tags': [],
    },
]

score_types = [
    {
        'name': 'Evaluation 1',
        'description': "Evaluation script 1",
        'code': "example.py",
        'game': "Game 1",
    },
]

score_field_types = [
    {
        'group': 'Evaluation 1',
        'name': 'collected_coins',
        'description': "Coins collected",
        'min': 0,
        'max': None,
    },
    {
        'group': 'Evaluation 1',
        'name': 'accuracy',
        'description': "Accuracy",
        # TODO: should these be set
        'min': None,
        'max': None,
    },
]

scores = [
    {
        'type': 'Evaluation 1',
        'time': '2000-01-01 01:00:00',
        'fields': [
            {
                'type': 'collected_coins',
                'value': 25,
            },
            {
                'type': 'accuracy',
                'value': 1, # TODO: is this realistic
            },
        ]
    }
]

groups = [
    {
        'name': "Administrator",
        'permissions': [],
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

    for group_name in data.get('groups', []):
        group = Group.objects.get(name=group_name)
        user.groups.add(group)

    user.save()

    return user

def add_group(data: Dict) -> Group:
    """Create a django user group"""

    group = Group.objects.get_or_create(name=data['name'])[0]
    for perm_name in data['permissions']:
        perm = Permission.objects.get(codename=perm_name)
        group.permissions.add(perm)

    group.save()

    return group

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


def add_score_type(data: Dict) -> ScoreTable:
    """Create an na score type"""

    game = Game.objects.get(name=data['game'])
    score_type = ScoreTable.objects.get_or_create(
        name=data['name'],
        defaults={
            'description': data['description'],
            'code': add_media_from_static(ScoreTable.MEDIA_SUBDIR, data['code']),
            'game': game,
        },
    )[0]

    return score_type


def add_score_field_type(data: Dict) -> ScoreColumn:
    """Create a na score field type"""

    group = ScoreTable.objects.get(name=data['group'])
    score_type = ScoreColumn.objects.get_or_create(
        group=group,
        name=data['name'],
        defaults={
            'description': data['description'],
            'min': data['min'],
            'max': data['max'],
        },
    )[0]

    return score_type


def add_score_field(data: Dict, group: ScoreRow) -> ScoreField:
    """Create a na score field"""

    field_type = ScoreColumn.objects.get(group=group.table, name=data['type'])
    type = ScoreField.objects.get_or_create(
        type=field_type,
        group=group,
        defaults={
            'value': data['value'],
        }
    )[0]
    return type


def add_score(data: Dict):
    group = ScoreTable.objects.get(name=data['type'])
    time = timezone.datetime.strptime(data['time'], "%Y-%m-%d %I:%M:%S").replace(tzinfo=utc)
    score = ScoreRow.objects.get_or_create(
        group=group,
        time=time,
    )[0]
    for field in data['fields']:
        add_score_field(field, score)
    return score


# TODO: PlayerTag


def populate():
    """Populate the database with example data"""

    for data in groups:
        add_group(data)
    for data in users:
        add_user(data)
    for data in game_tags:
        add_game_tag(data)
    for data in games:
        add_game(data)
    for data in players:
        add_player(data)
    for data in score_types:
        add_score_type(data)
    for data in score_field_types:
        add_score_field_type(data)
    for data in scores:
        add_score(data)


if __name__ == "__main__":
    populate()
