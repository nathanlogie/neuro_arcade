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

from na.models import GameTag, Game, Player, PlayerTag, Score

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
        'tags': ["Tracking Games", "High AI Score"],
        'score_type': "{collected_coins: {max: 100, type: int}}"
    },
    {
        'name': "Flying Objects",
        'description': "A game where objects fly through the air and you have to select the correct object",
        'owner': "hippo88",
        'icon': "example.png",
        'tags': ["Judgement Games", "High Human Player Score"],
        'score_type': "{collected_points: {max: 20, type: int}}"
    },
    {
        'name': "Object Crops",
        'description': "A game where you have to keep track of flying objects that soemtimes go behind a barrier",
        'owner': "kangaroo14",
        'icon': "example.png",
        'tags': ["Tracking Games", "High AI Score"],
        'score_type': "{collected_points: {max: 100.0, type: float}}"
    },
    {
        'name': "Block Drops",
        'description': "A game where falling blocks need to be arranged to create full lines",
        'owner': "giraffe10",
        'icon': "example.png",
        'tags': ["Pattern Recognition Games", "Strategic Games"],
        'score_type': "{collected_points: {max: 10000, type: int}}"
    },
    {
        'name': "2048",
        'description': "A game where blocks are combined to try and make the number 2048",
        'owner': "giraffe10",
        'icon': "example.png",
        'tags': ["Puzzle Games", "Strategic Games", "Featured"],
        'score_type': "{collected_points: {max: 10000, type: int}}"
    },
    {
        'name': "Space Creatures",
        'description': "A game where aliens come in from the sky and need to be shot down before they reach you",
        'owner': "duck44",
        'icon': "example.png",
        'tags': ["Reflex Games", "Tracking Games", "Featured"],
        'score_type': "{collected_points: {max: 100.0, type: float}}"
    },
    {
        'name': "Flying Bird",
        'description': "A game where you need to correctly time jumps to get through small spaces",
        'owner': "duck44",
        'icon': "example.png",
        'tags': ["Reflex Games", "Timing Games", "Featured"],
        'score_type': "{collected_points: {max: 10000, type: int}}"
    },
    {
        'name': "Suduko",
        'description': "A game where you need to solve sudoku puzzles in the quickest time",
        'owner': "penguin726",
        'icon': "example.png",
        'tags': ["High AI Score", "Puzzle Games", "Problem Solving Games"],
        'score_type': "{time_taken: {max: 600.0, type: float}}"
    },
    {
        'name': "Maze",
        'description': "A game where you need to escape the maze in the quickest time",
        'owner': "duck44",
        'icon': "example.png",
        'tags': ["High Human Score", "Puzzle Games", "Problem Solving Games"],
        'score_type': "{time_taken: {max: 600.0, type: float}}"
    },
    {
        'name': "Music Jump",
        'description': "A game where you need to jump and dodge obstacles however it is the same puzzle each time so "
                       "requires memory",
        'owner': "kangaroo14",
        'icon': "example.png",
        'tags': ["Reflex Games", "Pattern Recognition Games", "Memory Games", "Timing Games", "Featured"],
        'score_type': "{attempt_made: {max: 100, type: int}}"
    },
    {
        'name': "Brick Breaker",
        'description': "A game where you need break the bricks using a ball the quickest",
        'owner': "hippo88",
        'icon': "example.png",
        'tags': ["Strategic Games", "Tracking Games", "Featured"],
        'score_type': "{time_taken: {max: 600.0, type: float}}"
    },
    {
        'name': "Minesweeper",
        'description': "A game where you need find all the bombs",
        'owner': "panda22",
        'icon': "example.png",
        'tags': ["Strategic Games", "Puzzle Games", "Featured"],
        'score_type': "{time_taken: {max: 600.0, type: float}}"
    },
    {
        'name': "Snake",
        'description': "A game where you need to get the longest snake possible without crashing",
        'owner': "panda22",
        'icon': "example.png",
        'tags': ["Strategic Games", "Puzzle Games", "Featured"],
        'score_type': "{collected_points: {max: 200, type: int}}"
    },
    {
        'name': "Simon Says",
        'description': "A game where you need to memorise the pattern",
        'owner': "giraffe10",
        'icon': "example.png",
        'tags': ["Memory Games", "Pattern Recognition Games", "Featured"],
        'score_type': "{collected_points: {max: 25, type: int}}"
    },
    {
        'name': "Frog Road",
        'description': "A game where you need to get the frog as far across the road as possible",
        'owner': "panda22",
        'icon': "example.png",
        'tags': ["Timing Games", "Reflex Games", "High AI Score"],
        'score_type': "{collected_points: {max: 250, type: int}}"
    },
    {
        'name': "Spelling",
        'description': "A game where you need to find the word spelled incorrectly the quickest",
        'owner': "lion589",
        'icon': "example.png",
        'tags': ["Pattern Recognition Games", "Problem Solving Games", "Featured"],
        'score_type': "{time_taken: {max: 600.0, type: float}}"
    },
    {
        'name': "Connections",
        'description': "A game where you need to find the four sets of connections between a set of words",
        'owner': "duck44",
        'icon': "example.png",
        'tags': ["Pattern Recognition Games", "Featured", "High Human Player Score"],
        'score_type': "{time_taken: {max: 600.0, type: float}}"
    },
    {
        'name': "Words",
        'description': "A game where you need to find the most words with the given letters",
        'owner': "lion589",
        'icon': "example.png",
        'tags': ["Pattern Recognition Games", "Problem Solving Games", "Featured"],
        'score_type': "{collected_points: {max: 75, type: int}}"
    },
    {
        'name': "Wordsearch",
        'description': "A game where you need to solve the wordsearch the quickest",
        'owner': "lion589",
        'icon': "example.png",
        'tags': ["Puzzle Games", "Problem Solving Games", "Featured"],
        'score_type': "{time_taken: {max: 600.0, type: float}}"
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
        'name': "AI",
        'description': "AI players",
    },
    {
        'name': "Human Player",
        'description': "Human players",
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
        'player_tags': ["High Puzzle Performance", "Human Player", "High Reflex Performance"],
    },
    {
        'name': 'Leonard Garry',
        'is_ai': False,
        'user': 'fox789',
        'description': 'human player that is owned by fox789',
        'player_tags': ["High Memory Performance", "Human Player", "High Timing Performance"],
    },
    {
        'name': 'Shelly Giles',
        'is_ai': False,
        'user': 'rhino888',
        'description': 'human player that is owned by rhino888',
        'player_tags': ["High Problem Solving Performance", "Human Player", "High Strategic Performance"],
    },
    {
        'name': 'Billy Bennett',
        'is_ai': False,
        'user': 'bear234',
        'description': 'human player that is owned by bear234',
        'player_tags': ["High Problem Pattern Recognition Performance", "Human Player", "High Judgement Performance"],
    },
    {
        'name': 'Zebra Bot',
        'is_ai': True,
        'user': 'zebra777',
        'description': 'AI player that is owned by zebra777',
        'player_tags': ["High Puzzle Performance", "AI", "High Reflex Performance"],
    },
    {
        'name': 'Monkey Bot',
        'is_ai': True,
        'user': 'monkey555',
        'description': 'AI player that is owned by monkey555',
        'player_tags': ["High Memory Performance", "AI", "High Timing Performance"],
    },
    {
        'name': 'Tiger Bot',
        'is_ai': True,
        'user': 'tiger321',
        'description': 'AI player that is owned by tiger321',
        'player_tags': ["High Problem Solving Performance", "Human Player", "High Strategic Performance"],
    },
    {
        'name': 'Elephant Bot',
        'is_ai': True,
        'user': 'elephant456',
        'description': 'AI player that is owned by elephant456',
        'player_tags': ["High Problem Pattern Recognition Performance", "Human Player", "High Judgement Performance"],
    },
]

score_table = [
    {
        'name': 'Varying Shapes Evaluation',
        'description': "Varying Shapes Script",
        'evaluation': "example.py",
        'game': "Varying Shapes",
    },
    {
        'name': 'Flying Objects Evaluation',
        'description': "Flying Objects Script",
        'evaluation': "example.py",
        'game': "Flying Objects",
    },
    {
        'name': 'Object Crops Evaluation',
        'description': "Object Crops Script",
        'evaluation': "example.py",
        'game': "Object Crops",
    },
    {
        'name': 'Block Drops Evaluation',
        'description': "Block Drops Script",
        'evaluation': "example.py",
        'game': "Block Drops",
    },
    {
        'name': '2048 Evaluation',
        'description': "2048 Script",
        'evaluation': "example.py",
        'game': "2048",
    },
    {
        'name': 'Space Creatures Evaluation',
        'description': "Space Creatures Script",
        'evaluation': "example.py",
        'game': "Space Creatures",
    },
    {
        'name': 'Flying Bird Evaluation',
        'description': "Flying Bird Script",
        'evaluation': "example.py",
        'game': "Flying Bird",
    },
    {
        'name': 'Suduko Evaluation',
        'description': "Suduko Script",
        'evaluation': "example.py",
        'game': "Suduko",
    },
    {
        'name': 'Maze Evaluation',
        'description': "Maze Script",
        'evaluation': "example.py",
        'game': "Maze",
    },
    {
        'name': 'Music Jump Evaluation',
        'description': "Music Jump Script",
        'evaluation': "example.py",
        'game': "Music Jump",
    },
    {
        'name': 'Brick Breaker Evaluation',
        'description': "Brick Breaker Script",
        'evaluation': "example.py",
        'game': "Brick Breaker",
    },
    {
        'name': 'Minesweeper Evaluation',
        'description': "Minesweeper Script",
        'evaluation': "example.py",
        'game': "Minesweeper",
    },
    {
        'name': 'Snake Evaluation',
        'description': "Snake Script",
        'evaluation': "example.py",
        'game': "Snake",
    },
    {
        'name': 'Simon Says Evaluation',
        'description': "Simon Says Script",
        'evaluation': "example.py",
        'game': "Simon Says",
    },
    {
        'name': 'Frog Road Evaluation',
        'description': "Frog Road Script",
        'evaluation': "example.py",
        'game': "Frog Road",
    },
    {
        'name': 'Spelling Evaluation',
        'description': "Spelling Script",
        'evaluation': "example.py",
        'game': "Spelling",
    },
    {
        'name': 'Connections Evaluation',
        'description': "Connections Script",
        'evaluation': "example.py",
        'game': "Connections",
    },
    {
        'name': 'Words Evaluation',
        'description': "Words Script",
        'evaluation': "example.py",
        'game': "Words",
    },
    {
        'name': 'Wordsearch Evaluation',
        'description': "Wordsearch Script",
        'evaluation': "example.py",
        'game': "Wordsearch",
    },
]

score_column = [
    {
        'table': 'Varying Shapes Evaluation',
        'name': 'Varying Shapes Field',
        'description': "Number of coins collected",
        'min': 0,
        'max': 100,
    },
    {
        'table': 'Flying Objects Evaluation',
        'name': 'Flying Objects Field',
        'description': "Number of points collected",
        'min': 0,
        'max': 20,
    },
    {
        'table': 'Object Crops Evaluation',
        'name': 'Object Crops Field',
        'description': "Number of points collected",
        'min': 0,
        'max': 100,
    },
    {
        'table': 'Block Drops Evaluation',
        'name': 'Block Drops Field',
        'description': "Number of points collected",
        'min': 0,
        'max': 10000,
    },
    {
        'table': '2048 Evaluation',
        'name': '2048 Field',
        'description': "Number of points collected",
        'min': 0,
        'max': 10000,
    },
    {
        'table': 'Space Creatures Evaluation',
        'name': 'Space Creatures Field',
        'description': "Number of points collected",
        'min': 0,
        'max': 10,
    },
    {
        'table': 'Flying Bird Evaluation',
        'name': 'Flying Bird Field',
        'description': "Number of points collected",
        'min': 0,
        'max': 10000,
    },
    {
        'table': 'Suduko Evaluation',
        'name': 'Suduko Field',
        'description': "Time taken to complete",
        'min': 0,
        'max': 600,
    },
    {
        'table': 'Maze Evaluation',
        'name': 'Maze Field',
        'description': "Time taken to complete",
        'min': 0,
        'max': 600,
    },
    {
        'table': 'Music Jump Evaluation',
        'name': 'Music Jump Field',
        'description': "Number of attempts taken to complete",
        'min': 0,
        'max': 100,
    },
    {
        'table': 'Brick Breaker Evaluation',
        'name': 'Brich Breaker Field',
        'description': "Time taken to complete",
        'min': 0,
        'max': 600,
    },
    {
        'table': 'Minesweeper Evaluation',
        'name': 'Minesweeper Field',
        'description': "Time taken to complete",
        'min': 0,
        'max': 600,
    },
    {
        'table': 'Snake Evaluation',
        'name': 'Snake Field',
        'description': "Number of points collected",
        'min': 0,
        'max': 200,
    },
    {
        'table': 'Simon Says Evaluation',
        'name': 'Simon Says Field',
        'description': "Number of points collected",
        'min': 0,
        'max': 25,
    },
    {
        'table': 'Frog Road Evaluation',
        'name': 'Frog Road Field',
        'description': "Number of points collected",
        'min': 0,
        'max': 250,
    },
    {
        'table': 'Spelling Evaluation',
        'name': 'Spelling Field',
        'description': "Time taken to complete",
        'min': 0,
        'max': 600,
    },
    {
        'table': 'Connections Evaluation',
        'name': 'Connections Field',
        'description': "Time taken to complete",
        'min': 0,
        'max': 600,
    },
    {
        'table': 'Words Evaluation',
        'name': 'Words Field',
        'description': "Number of points collected",
        'min': 0,
        'max': 75,
    },
    {
        'table': 'Wordsearch Evaluation',
        'name': 'Wordsearch Field',
        'description': "Time taken to complete",
        'min': 0,
        'max': 600,
    },
]

score_row = [
    {
        'type': 'Varying Shapes Evaluation',
        'time': '2023-01-04 19:20:50',
        'player': 'Amanda Wilson',
        'fields': [
            {
                'column': 'Varying Shapes Field',
                'value': 25,
            },
        ]
    },
    {
        'type': 'Flying Objects Evaluation',
        'time': '2023-01-21 00:03:18',
        'player': 'Leonard Garry',
        'fields': [
            {
                'column': 'Flying Objects Field',
                'value': 6,
            },
        ]
    },
    {
        'type': 'Object Crops Evaluation',
        'time': '2023-02-03 10:45:36',
        'player': 'Shelly Giles',
        'fields': [
            {
                'column': 'Object Crops Field',
                'value': 9,
            },
        ]
    },
    {
        'type': 'Block Drops Evaluation',
        'time': '2023-01-08 15:57:54',
        'player': 'Billy Bennett',
        'fields': [
            {
                'column': 'Block Drops Field',
                'value': 1627.3,
            },
        ]
    },
    {
        'type': '2048 Evaluation',
        'time': '2023-02-12 02:19:42',
        'player': 'Zebra Bot',
        'fields': [
            {
                'column': '2048 Field',
                'value': 82934.1,
            },
        ]
    },
    {
        'type': 'Space Creatures Evaluation',
        'time': '2023-01-16 20:28:27',
        'player': 'Monkey Bot',
        'fields': [
            {
                'column': 'Space Creatures Field',
                'value': 28,
            },
        ]
    },
    {
        'type': 'Flying Bird Evaluation',
        'time': '2023-01-21 04:50:04',
        'player': 'Tiger Bot',
        'fields': [
            {
                'column': 'Flying Bird Field',
                'value': 25,
            },
        ]
    },
    {
        'type': 'Suduko Evaluation',
        'time': '2023-02-05 15:12:01',
        'player': 'Elephant Bot',
        'fields': [
            {
                'column': 'Suduko Field',
                'value': 273.2,
            },
        ]
    },
    {
        'type': 'Maze Evaluation',
        'time': '2023-02-06 03:01:16',
        'player': 'Elephant Bot',
        'fields': [
            {
                'column': 'Maze Field',
                'value': 202.2,
            },
        ]
    },
    {
        'type': 'Music Jump Evaluation',
        'time': '2023-02-01 09:14:38',
        'player': 'Tiger Bot',
        'fields': [
            {
                'column': 'Music Jump Field',
                'value': 16,
            },
        ]
    },
    {
        'type': 'Varying Shapes Evaluation',
        'time': '2023-01-14 02:36:26',
        'player': 'Monkey Bot',
        'fields': [
            {
                'column': 'Varying Shapes Field',
                'value': 12,
            },
        ]
    },
    {
        'type': 'Flying Objects Evaluation',
        'time': '2023-02-03 04:47:10',
        'player': 'Zebra Bot',
        'fields': [
            {
                'column': 'Flying Objects Field',
                'value': 3,
            },
        ]
    },
    {
        'type': 'Object Crops Evaluation',
        'time': '2023-02-10 17:08:25',
        'player': 'Billy Bennett',
        'fields': [
            {
                'column': 'Object Crops Field',
                'value': 6,
            },
        ]
    },
    {
        'type': 'Block Drops Evaluation',
        'time': '2023-01-19 21:31:52',
        'player': 'Shelly Giles',
        'fields': [
            {
                'column': 'Block Drops Field',
                'value': 1738.2,
            },
        ]
    },
    {
        'type': '2048 Evaluation',
        'time': '2023-02-13 15:43:40',
        'player': 'Leonard Garry',
        'fields': [
            {
                'column': '2048 Field',
                'value': 627.2,
            },
        ]
    },
    {
        'type': 'Space Creatures Evaluation',
        'time': '2023-02-12 23:32:55',
        'player': 'Amanda Wilson',
        'fields': [
            {
                'column': 'Space Creatures Field',
                'value': 3,
            },
        ]
    },
    {
        'type': 'Flying Bird Evaluation',
        'time': '2023-01-26 18:55:22',
        'player': 'Amanda Wilson',
        'fields': [
            {
                'column': 'Flying Bird Field',
                'value': 45,
            },
        ]
    },
    {
        'type': 'Suduko Evaluation',
        'time': '2023-01-11 13:17:49',
        'player': 'Leonard Garry',
        'fields': [
            {
                'column': 'Suduko Field',
                'value': 347.2,
            },
        ]
    },
    {
        'type': 'Maze Evaluation',
        'time': '2023-01-12 06:39:37',
        'player': 'Shelly Giles',
        'fields': [
            {
                'column': 'Maze Field',
                'value': 502.1,
            },
        ]
    },
    {
        'type': 'Music Jump Evaluation',
        'time': '2023-01-04 19:20:50',
        'player': 'Billy Bennett',
        'fields': [
            {
                'column': 'Music Jump Field',
                'value': 25,
            },
        ]
    },
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
            'score_type': '{}'
        },
    )[0]
    game.description = data.get('description', "no description")

    if 'icon' in data:
        game.icon.name = add_media_from_static(Game.MEDIA_SUBDIR, data['icon'])

    for tag_name in data.get('tags', []):
        try:
            tag = GameTag.objects.get(name=tag_name)
        except GameTag.DoesNotExist:
            tag = add_game_tag({'name': tag_name, 'description': 'Default description'})

        game.tags.add(tag)

    # TODO: create score types for Games in the population script

    game.save()

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

    for tag_name in data.get('player_tags', []):
        try:
            tag = PlayerTag.objects.get(name=tag_name)
        except PlayerTag.DoesNotExist:
            # Create the tag if it doesn't exist
            tag = add_player_tag({'name': tag_name, 'description': 'Default description'})

        player.player_tags.add(tag)

    player.save()

    return player


# DEPRECATED!!
# def add_score_table(data: Dict) -> ScoreTable:
#     """Create an na score table"""
#
#     game = Game.objects.get(name=data['game'])
#     score_table = ScoreTable.objects.get_or_create(
#         name=data['name'],
#         defaults={
#             'description': data['description'],
#             'evaluation': add_media_from_static(ScoreTable.MEDIA_SUBDIR, data['evaluation']),
#             'game': game,
#         },
#     )[0]
#
#     return score_table


# DEPRECATED!!
# def add_score_column(data: Dict) -> ScoreColumn:
#     """Create a na score field type"""
#
#     table = ScoreTable.objects.get(name=data['table'])
#     score_column = ScoreColumn.objects.get_or_create(
#         table=table,
#         name=data['name'],
#         defaults={
#             'description': data['description'],
#             'min': data['min'],
#             'max': data['max'],
#         },
#     )[0]
#
#     return score_column


# DEPRECATED!!
# def add_score_field(data: Dict, group: ScoreRow) -> ScoreField:
#     """Create a na score field"""
#
#     score_column = ScoreColumn.objects.get(table=group.table, name=data['column'])
#     score_field = ScoreField.objects.get_or_create(
#         column=score_column,
#         row=group,
#         defaults={
#             'value': data['value'],
#         }
#     )[0]
#     return score_field


# DEPRECATED!!
# def add_score_row(data: Dict):
#     table = ScoreTable.objects.get(name=data['type'])
#     time = timezone.datetime.strptime(data['time'], "%Y-%m-%d %H:%M:%S").replace(tzinfo=utc)
#     player, _ = Player.objects.get_or_create(name=data['player'])
#     score = ScoreRow.objects.get_or_create(
#         table=table,
#         time=time,
#         player=player,
#     )[0]
#
#     for field in data['fields']:
#         add_score_field(field, score)
#     return score


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
    for data in player_tags:
        add_player_tag(data)
    for data in players:
        add_player(data)
    # for data in score_table:
    #     add_score_table(data)
    # for data in score_column:
    #     add_score_column(data)
    # for data in score_row:
    #     add_score_row(data)

    print("Database populated!")

if __name__ == "__main__":
    populate()
