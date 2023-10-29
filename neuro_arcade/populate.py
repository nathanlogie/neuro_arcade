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

from na.models import GameTag, Game, Player, AITag, AI, UserInfo, ScoreType, Score

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
        'tags': ["Tag 1", "Tag 2", "Tag 3"],
    },
    {
        'name': "Game 2",
        'description': "It's Game 2.",
        'owner': "User2",
        'icon': "example.png",
        'tags': ["Tag 2"],
    },
    {
        'name': "Game 3",
        'description': "It's Game 3.",
        'owner': "User3",
        'icon': "example.png",
        'tags': ["Tag 3"],
    },
]

def add_file(folder: str, filename: str) -> str:
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
    """Create an na game tag"""

    tag = GameTag.objects.get_or_create(name=data['name'])[0]
    tag.description = data.get('description', "")
    tag.save()

    return tag


def add_game(data: Dict) -> Game:
    """Create an na game"""

    game = Game.objects.get_or_create(
        name=data['name'],
        defaults={
            'owner': User.objects.get(username=data['owner']),
        },
    )[0]
    game.description = data.get('description', "")
    
    if 'icon' in data:
        game.icon.name = add_file(Game.MEDIA_SUBDIR, data['icon'])

    for tag_name in data.get('tags', []):
        tag = GameTag.objects.get(name=tag_name)
        game.tags.add(tag)

    game.save()

    return game

# TODO: Player, AITag, AI, UserInfo, ScoreType, Score

def populate():
    """Populate the database with example data"""

    for data in users:
        add_user(data)
    for data in game_tags:
        add_game_tag(data)
    for data in games:
        add_game(data)


if __name__ == "__main__":
    populate()
