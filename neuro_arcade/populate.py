#!/usr/bin/env python

"""
Populate the database with example data
"""
import random

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

from django.contrib.auth.models import Group, Permission
from typing import Dict
from na.models import *

# For the randomly assigned priority


users = [
    {
        'username': "kangaroo14",
        'email': "kangaroo14@gmail.com",
    },
    {
        'username': "hippo88",
        'email': "hippo88@gmail.com",
    },
    {
        'username': "lion589",
        'email': "lion589@hotmail.com",
    },
    {
        'username': "panda22",
        'email': "22panda@hotmail.com",
    },
    {
        'username': "penguin726",
        'email': "ilovepenguins@hotmail.com",
    },
    {
        'username': "parrot66",
        'email': "parrot66@outlook.com",
    },
    {
        'username': "giraffe10",
        'email': "giraffe10@yahoo.co.uk",
    },
    {
        'username': "duck44",
        'email': "duck44@sky.com",
    },
    {
        'username': "cheetah123",
        'email': "cheetah123@sky.com",
    },
    {
        'username': "koala777",
        'email': "777koala@sky.com",
    },
    {
        'username': "elephant456",
        'email': "elephant456@yahoo.co.uk",
    },
    {
        'username': "tiger321",
        'email': "tiger321@yahoo.co.uk",
    },
    {
        'username': "monkey555",
        'email': "monkey555@hotmail.com",
    },
    {
        'username': "zebra777",
        'email': "zebra777@hotmail.com",
    },
    {
        'username': "bear234",
        'email': "bear234@hotmail.com",
    },
    {
        'username': "rhino888",
        'email': "rhino888@gmail.com",
    },
    {
        'username': "fox789",
        'email': "fox789@gmail.com",
    },
    {
        'username': "sloth111",
        'email': "sloth111@gmail.com",
    },
    {
        'username': "Admin1",
        'email': "admin1@email.com",
        'groups': ["Administrator"],
    },
]

game_tags = [
    {
        'name': "Featured",
        'description': "The current featured games",
    },
    {
        'name': "Tracking Games",
        'description': "Games that involve tracking an object",
    },
    {
        'name': "Judgement Games",
        'description': "Games that involve making decisions",
    },
    {
        'name': "High AI Score",
        'description': "Games where AI are performing better than human players",
    },
    {
        'name': "High Human Player Score",
        'description': "Games where human players are performing better than AI",
    },
    {
        'name': "Strategic Games",
        'description': "Games where a stategy has to be formed to perform well",
    },
    {
        'name': "Pattern Recognition Games",
        'description': "Games where patterns need to be detected",
    },
    {
        'name': "Problem Solving Games",
        'description': "Games where problem solving skills are tested",
    },
    {
        'name': "Timing Games",
        'description': "Games to test precise timing skills",
    },
    {
        'name': "Reflex Games",
        'description': "Games to test reflex skills",
    },
    {
        'name': "Puzzle Games",
        'description': "Games where puzzles are completed",
    },
    {
        'name': "Memory Games",
        'description': "Games where memorisation is required",
    },
]

games = [
    {
        'name': "Varying Shapes",
        'description': "A game where you deal with a number of varying shapes",
        'owner': "kangaroo14",
        'icon': "example.png",
        'tags': ["Tracking Games", "High AI Score", "Featured"],
        'score_type': "{collected_coins: {max: 100, type: int}}",
        'priority': 100
    },
    {
        'name': "Flying Objects",
        'description': "A game where objects fly through the air and you have to select the correct object",
        'owner': "hippo88",
        'icon': "example.png",
        'tags': ["Judgement Games", "High Human Player Score", "Featured"],
        'score_type': "{collected_points: {max: 20, type: int}}",
        'priority': 90
    },
    {
        'name': "Object Crops",
        'description': "A game where you have to keep track of flying objects that soemtimes go behind a barrier",
        'owner': "kangaroo14",
        'icon': "example.png",
        'tags': ["Tracking Games", "High AI Score", "Featured"],
        'score_type': "{collected_points: {max: 100.0, type: float}}",
        'priority': 80
    },
    {
        'name': "Block Drops",
        'description': "A game where falling blocks need to be arranged to create full lines",
        'owner': "giraffe10",
        'icon': "example.png",
        'tags': ["Pattern Recognition Games", "Strategic Games"],
        'score_type': "{collected_points: {max: 10000, type: int}}",
        'priority': 70
    },
    {
        'name': "2048",
        'description': "A game where blocks are combined to try and make the number 2048",
        'owner': "giraffe10",
        'icon': "example.png",
        'tags': ["Puzzle Games", "Strategic Games"],
        'score_type': "{collected_points: {max: 10000, type: int}}",
        'priority': 60
    },
    {
        'name': "Space Creatures",
        'description': "A game where aliens come in from the sky and need to be shot down before they reach you",
        'owner': "duck44",
        'icon': "example.png",
        'tags': ["Reflex Games", "Tracking Games"],
        'score_type': "{collected_points: {max: 100.0, type: float}}",
        'priority': 50
    },
    {
        'name': "Flying Bird",
        'description': "A game where you need to correctly time jumps to get through small spaces",
        'owner': "duck44",
        'icon': "example.png",
        'tags': ["Reflex Games", "Timing Games", "Featured"],
        'score_type': "{collected_points: {max: 10000, type: int}}",
        'priority': 100
    },
    {
        'name': "Suduko",
        'description': "A game where you need to solve sudoku puzzles in the quickest time",
        'owner': "penguin726",
        'icon': "example.png",
        'tags': ["High AI Score", "Puzzle Games", "Problem Solving Games"],
        'score_type': "{time_taken: {max: 600.0, type: float}}",
        'priority': 30
    },
    {
        'name': "Maze",
        'description': "A game where you need to escape the maze in the quickest time",
        'owner': "duck44",
        'icon': "example.png",
        'tags': ["High Human Score", "Puzzle Games", "Problem Solving Games"],
        'score_type': "{time_taken: {max: 600.0, type: float}}",
        'priority': 20
    },
    {
        'name': "Music Jump",
        'description': "A game where you need to jump and dodge obstacles however it is the same puzzle each time so "
                       "requires memory",
        'owner': "kangaroo14",
        'icon': "example.png",
        'tags': ["Reflex Games", "Pattern Recognition Games", "Memory Games", "Timing Games", "Featured"],
        'score_type': "{attempt_made: {max: 100, type: int}}",
        'priority': 100
    },
    {
        'name': "Brick Breaker",
        'description': "A game where you need break the bricks using a ball the quickest",
        'owner': "hippo88",
        'icon': "example.png",
        'tags': ["Strategic Games", "Tracking Games"],
        'score_type': "{time_taken: {max: 600.0, type: float}}",
        'priority': 10
    },
    {
        'name': "Minesweeper",
        'description': "A game where you need find all the bombs",
        'owner': "panda22",
        'icon': "example.png",
        'tags': ["Strategic Games", "Puzzle Games"],
        'score_type': "{time_taken: {max: 600.0, type: float}}",
        'priority': 10
    },
    {
        'name': "Snake",
        'description': "A game where you need to get the longest snake possible without crashing",
        'owner': "panda22",
        'icon': "example.png",
        'tags': ["Strategic Games", "Puzzle Games", "Featured"],
        'score_type': "{collected_points: {max: 200, type: int}}",
        'priority': 85
    },
    {
        'name': "Simon Says",
        'description': "A game where you need to memorise the pattern",
        'owner': "giraffe10",
        'icon': "example.png",
        'tags': ["Memory Games", "Pattern Recognition Games", "Featured"],
        'score_type': "{collected_points: {max: 25, type: int}}",
        'priority': 95
    },
    {
        'name': "Frog Road",
        'description': "A game where you need to get the frog as far across the road as possible",
        'owner': "panda22",
        'icon': "example.png",
        'tags': ["Timing Games", "Reflex Games", "High AI Score"],
        'score_type': "{collected_points: {max: 250, type: int}}",
        'priority': 60
    },
    {
        'name': "Spelling",
        'description': "A game where you need to find the word spelled incorrectly the quickest",
        'owner': "lion589",
        'icon': "example.png",
        'tags': ["Pattern Recognition Games", "Problem Solving Games"],
        'score_type': "{time_taken: {max: 600.0, type: float}}",
        'priority': 5
    },
    {
        'name': "Connections",
        'description': "A game where you need to find the four sets of connections between a set of words",
        'owner': "duck44",
        'icon': "example.png",
        'tags': ["Pattern Recognition Games", "Featured", "High Human Player Score"],
        'score_type': "{time_taken: {max: 600.0, type: float}}",
        'priority': 100
    },
    {
        'name': "Words",
        'description': "A game where you need to find the most words with the given letters",
        'owner': "lion589",
        'icon': "example.png",
        'tags': ["Pattern Recognition Games", "Problem Solving Games"],
        'score_type': "{collected_points: {max: 75, type: int}}",
        'priority': 20
    },
    {
        'name': "Wordsearch",
        'description': "A game where you need to solve the wordsearch the quickest",
        'owner': "lion589",
        'icon': "example.png",
        'tags': ["Puzzle Games", "Problem Solving Games"],
        'score_type': "{time_taken: {max: 600.0, type: float}}",
        'priority': 10
    },
]

player_tags = [
    {
        'name': "Featured",
        'description': "The current featured players",
    },
    {
        'name': "High Tracking Performance",
        'description': "Players with high performance in tracking games",
    },
    {
        'name': "High Judgement Performance",
        'description': "Players with high performance in judgement games",
    },
    {
        'name': "High Strategy Performance",
        'description': "Players with high performance in stategy games",
    },
    {
        'name': "High Pattern Recognition Performance",
        'description': "Players with high performance in pattern recognition games",
    },
    {
        'name': "High Problem Solver Performance",
        'description': "Players with high performance in problem solving games",
    },
    {
        'name': "High Timing Performance",
        'description': "Players with high performance in timing games",
    },
    {
        'name': "High Reflex Performance",
        'description': "Players with high performance in reflex games",
    },
    {
        'name': "High Puzzle Performance",
        'description': "Players with high performance in puzzle games",
    },
    {
        'name': "High Memory Performance",
        'description': "Players with high performance in memory games",
    },

]

players = [
    {
        'name': 'Amanda Wilson',
        'is_ai': False,
        'user': 'sloth111',
        'description': 'human player that is owned by sloth111',
        'tags': ["High Puzzle Performance", "High Reflex Performance"],
    },
    {
        'name': 'Leonard Garry',
        'is_ai': False,
        'user': 'fox789',
        'description': 'human player that is owned by fox789',
        'tags': ["High Memory Performance", "High Timing Performance"],
    },
    {
        'name': 'Shelly Giles',
        'is_ai': False,
        'user': 'rhino888',
        'description': 'human player that is owned by rhino888',
        'tags': ["High Problem Solving Performance", "High Strategic Performance"],
    },
    {
        'name': 'Billy Bennett',
        'is_ai': False,
        'user': 'bear234',
        'description': 'human player that is owned by bear234',
        'tags': ["High Problem Pattern Recognition Performance", "High Judgement Performance"],
    },
    {
        'name': 'Zebra Bot',
        'is_ai': True,
        'user': 'zebra777',
        'description': 'AI player that is owned by zebra777',
        'tags': ["High Puzzle Performance", "High Reflex Performance"],
    },
    {
        'name': 'Monkey Bot',
        'is_ai': True,
        'user': 'monkey555',
        'description': 'AI player that is owned by monkey555',
        'tags': ["High Memory Performance", "High Timing Performance"],
    },
    {
        'name': 'Tiger Bot',
        'is_ai': True,
        'user': 'tiger321',
        'description': 'AI player that is owned by tiger321',
        'tags': ["High Problem Solving Performance", "High Strategic Performance"],
    },
    {
        'name': 'Elephant Bot',
        'is_ai': True,
        'user': 'elephant456',
        'description': 'AI player that is owned by elephant456',
        'tags': ["High Problem Pattern Recognition Performance", "High Judgement Performance"],
    },
]

score_types = {
    'Varying Shapes': {
        'headers': [
            {
                'name': 'Coins',
                'description': "Number of coins collected",
                'min': 0,
                'max': 100,
            }
        ]
    },
    'Flying Objects': {
        'headers': [
            {
                'name': 'Points',
                'description': "Number of points collected",
                'min': 0,
                'max': 20,
            }
        ]
    },
    'Object Crops': {
        'headers': [
            {
                'name': 'Points',
                'description': "Number of points collected",
                'min': 0,
                'max': 100,
            }
        ]
    },
    'Block Drops': {
        'headers': [
            {
                'name': 'Points',
                'description': "Number of points collected",
                'min': 0,
                'max': 10000,
            }
        ]
    },
    '2048': {
        'headers': [
            {
                'name': 'Points',
                'description': "Number of points collected",
                'min': 0,
                'max': 10000,
            }
        ]
    },
    'Space Creatures': {
        'headers': [
            {
                'name': 'Points',
                'description': "Number of points collected",
                'min': 0,
                'max': 10,
            },
            {
                'name': 'Time',
                'description': "Time",
                'min': 0,
                'max': 9999,
            },
            {
                'name': 'Coins',
                'description': "Coins collected",
                'min': 0,
                'max': 10,
            },
        ]
    },
    'Flying Bird': {
        'headers': [
            {
                "name": "Coins",
                "type": "int",
                "min": 0,
                "max": 100
            },
            {
                "name": "Points",
                "type": "float",
                "min": 0
            }
        ]
    },
    'Suduko': {
        'headers': [
            {
                'name': 'Time',
                'description': "Time taken to complete",
                'min': 0,
                'max': 600,
            }
        ]
    },
    'Maze': {
        'headers': [
            {
                'name': 'Time',
                'description': "Time taken to complete",
                'min': 0,
                'max': 600,
            }
        ]
    },
    'Music Jump': {
        'headers': [
            {
                'name': 'Attempts',
                'description': "Number of attempts taken to complete",
                'min': 0,
                'max': 100,
            }
        ]
    },
    'Brick Breaker': {
        'headers': [
            {
                'name': 'Time',
                'description': "Time taken to complete",
                'min': 0,
                'max': 600,
            }
        ]
    },
    'Minesweeper': {
        'headers': [
            {
                'name': 'Time',
                'description': "Time taken to complete",
                'min': 0,
                'max': 600,
            }
        ]
    },
    'Snake': {
        'headers': [
            {
                'name': 'Points',
                'description': "Number of points collected",
                'min': 0,
                'max': 200,
            }
        ]
    },
    'Simon Says': {
        'headers': [
            {
                'name': 'Points',
                'description': "Number of points collected",
                'min': 0,
                'max': 25,
            }
        ]
    },
    'Frog Road': {
        'headers': [
            {
                'name': 'Points',
                'description': "Number of points collected",
                'min': 0,
                'max': 250,
            }
        ]
    },
    'Spelling': {
        'headers': [
            {
                'name': 'Time',
                'description': "Time taken to complete",
                'min': 0,
                'max': 600,
            }
        ]
    },
    'Connections': {
        'headers': [
            {
                'name': 'Time',
                'description': "Time taken to complete",
                'min': 0,
                'max': 600,
            }
        ]
    },
    'Words': {
        'headers': [
            {
                'name': 'Points',
                'description': "Number of points collected",
                'min': 0,
                'max': 75,
            }
        ]
    },
    'Wordsearch': {
        'headers': [
            {
                'name': 'Time',
                'description': "Time taken to complete",
                'min': 0,
                'max': 600,
            }
        ]
    },
}

groups = [
    {
        'name': "Administrator",
        'permissions': [],
    },
]


def add_random_score(game: Game, player_list):
    player = random.choice(player_list)
    score = {}

    for header in game.score_type['headers']:
        mini = header.get('min', 0)
        maxi = header.get('max', 1000)
        score[header['name']] = random.randint(mini, maxi)

    game.score_set.create(
        player_id=player.id,
        game_id=game.id,
        score=score
    )


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
    userStatus = UserStatus.objects.get_or_create(user=user)

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
    game.score_type = score_types[data['name']]
    game.description = data.get('description', "no description")
    game.priority = data['priority']

    if 'icon' in data:
        game.icon.name = add_media_from_static(Game.ICON_SUBDIR, data['icon'])

    if 'evaluation' in data:
        game.evaluation_script.name = add_media_from_static(Game.EVALUATION_SUBDIR, data['evaluation'])

    for tag_name in data.get('tags', []):
        try:
            tag = GameTag.objects.get(name=tag_name)
        except GameTag.DoesNotExist:
            tag = add_game_tag({'name': tag_name, 'description': 'Default description'})

        game.tags.add(tag)

    game.save()

    # adding some random scores to this game
    for _ in range(random.randint(6, 12)):
        add_random_score(game, Player.objects.all())

    return game


def add_player_tag(data: Dict) -> PlayerTag:
    """Create a na player tag"""

    tag = PlayerTag.objects.get_or_create(name=data['name'])[0]
    tag.description = data.get('description', "")
    tag.save()

    return tag


def add_player(data: Dict):
    player = Player.objects.get_or_create(name=data['name'])[0]
    player.is_ai = data['is_ai']
    player.user = User.objects.get(username=data['user'])
    player.description = data['description']

    for tag_name in data.get('tags', []):
        try:
            tag = PlayerTag.objects.get(name=tag_name)
        except PlayerTag.DoesNotExist:
            # Create the tag if it doesn't exist
            tag = add_player_tag({'name': tag_name, 'description': 'Default description'})

        player.tags.add(tag)

    player.save()

    return player


def populate():
    """Populate the database with example data"""

    for data in groups:
        add_group(data)
    for data in users:
        data["status"] = "pending"
        add_user(data)
    for data in players:
        add_player(data)
    for data in player_tags:
        add_player_tag(data)
    for data in game_tags:
        # players need to exist at this point
        add_game_tag(data)
    for data in games:
        add_game(data)

    print("Database populated!")


if __name__ == "__main__":
    populate()
