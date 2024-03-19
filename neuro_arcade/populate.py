#!/usr/bin/env python

"""
Populate the database with example data
"""

# Imports need to be in a specific order
# autopep8: off

"""
Setup django
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuro_arcade.settings')

import django

django.setup()

"""
Main program
"""

import random
from shutil import copy
from typing import Dict

from neuro_arcade.settings import MEDIA_ROOT, STATIC_DIR
from na.models import *

USER_ICON_SUBDIR = 'user_icons'
PLAYER_ICON_SUBDIR = 'bot_icons'

# autopep8: on

# For the randomly assigned priority


users = [
    {
        'username': "kangaroo14",
        'email': "kangaroo14@gmail.com",
        'icon': "kangaroo14.jpeg",
    },
    {
        'username': "hippo88",
        'email': "hippo88@gmail.com",
        'icon': "hippo88.jpeg",
    },
    {
        'username': "lion589",
        'email': "lion589@hotmail.com",
        'icon': "lion589.jpeg",
    },
    {
        'username': "panda22",
        'email': "22panda@hotmail.com",
        'icon': "panda22.jpeg",
    },
    {
        'username': "penguin726",
        'email': "ilovepenguins@hotmail.com",
        'icon': "penguin726.jpeg",
    },
    {
        'username': "parrot66",
        'email': "parrot66@outlook.com",
        'icon': "parrot66.jpeg",
    },
    {
        'username': "giraffe10",
        'email': "giraffe10@yahoo.co.uk",
        'icon': "giraffe.jpeg",
    },
    {
        'username': "duck44",
        'email': "duck44@sky.com",
        'icon': "duck.jpeg",
    },
    {
        'username': "cheetah123",
        'email': "cheetah123@sky.com",
        'icon': "cheetah.jpeg",
    },
    {
        'username': "koala777",
        'email': "777koala@sky.com",
        'icon': "koala.jpeg",
    },
    {
        'username': "elephant456",
        'email': "elephant456@yahoo.co.uk",
        'icon': "elephant.jpeg",
    },
    {
        'username': "tiger321",
        'email': "tiger321@yahoo.co.uk",
        'icon': "tiger.jpeg",
    },
    {
        'username': "monkey555",
        'email': "monkey555@hotmail.com",
        'icon': "monkey.jpeg",
    },
    {
        'username': "zebra777",
        'email': "zebra777@hotmail.com",
        'icon': "zebra.jpeg",
    },
    {
        'username': "bear234",
        'email': "bear234@hotmail.com",
        'icon': "bear.jpeg",
    },
    {
        'username': "rhino888",
        'email': "rhino888@gmail.com",
        'icon': "rhino.jpeg",
    },
    {
        'username': "fox789",
        'email': "fox789@gmail.com",
        'icon': "fox.jpeg",
    },
    {
        'username': "sloth111",
        'email': "sloth111@gmail.com",
        'icon': "sloth.jpeg",
    },
]

game_tags = [
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
        'icon': "shapes.png",
        'tags': ["Tracking Games", "High AI Score"],
        'priority': 100,
        'evaluation': 'ex_coins_accuracy.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                },
                {
                    'name': 'Accuracy',
                    'type': 'float',
                    'min': 0,
                    'max': 1,
                }
            ]
        },
    },
    {
        'name': "Flying Objects",
        'description': "A game where objects fly through the air and you have to select the correct object",
        'owner': "hippo88",
        'icon': "objects.png",
        'tags': ["Judgement Games", "High Human Player Score"],
        'priority': 90,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Object Crops",
        'description': "A game where you have to keep track of flying objects that soemtimes go behind a barrier",
        'owner': "kangaroo14",
        'icon': "crops.png",
        'tags': ["Tracking Games", "High AI Score"],
        'priority': 80,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Block Drops",
        'description': "A game where falling blocks need to be arranged to create full lines",
        'owner': "giraffe10",
        'icon': "tetris.png",
        'tags': ["Pattern Recognition Games", "Strategic Games"],
        'priority': 70,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "2048",
        'description': "A game where blocks are combined to try and make the number 2048",
        'owner': "giraffe10",
        'icon': "2048.png",
        'tags': ["Puzzle Games", "Strategic Games"],
        'priority': 60,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Space Creatures",
        'description': "A game where aliens come in from the sky and need to be shot down before they reach you",
        'owner': "duck44",
        'icon': "creatures.png",
        'tags': ["Reflex Games", "Tracking Games"],
        'priority': 50,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Flying Bird",
        'description': "A game where you need to correctly time jumps to get through small spaces",
        'owner': "duck44",
        'icon': "flying-bird.png",
        'tags': ["Reflex Games", "Timing Games"],
        'priority': 100,
        'evaluation': 'ex_coins_points_accuracy.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                },
                {
                    'name': 'Points',
                    'type': 'float',
                },
                {
                    'name': 'Accuracy',
                    'type': 'float',
                    'min': 0,
                    'max': 1,
                },
            ]
        },
    },
    {
        'name': "Suduko",
        'description': "A game where you need to solve sudoku puzzles in the quickest time",
        'owner': "penguin726",
        'icon': "sudoku.png",
        'tags': ["High AI Score", "Puzzle Games", "Problem Solving Games"],
        'priority': 30,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Maze",
        'description': "A game where you need to escape the maze in the quickest time",
        'owner': "duck44",
        'icon': "maze.png",
        'tags': ["High Human Score", "Puzzle Games", "Problem Solving Games"],
        'priority': 20,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Music Jump",
        'description': "A game where you need to jump and dodge obstacles however it is the same puzzle each time so "
                       "requires memory",
        'owner': "kangaroo14",
        'icon': "music.png",
        'tags': ["Reflex Games", "Pattern Recognition Games", "Memory Games", "Timing Games"],
        'priority': 100,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Brick Breaker",
        'description': "A game where you need break the bricks using a ball the quickest",
        'owner': "hippo88",
        'icon': "bricks.png",
        'tags': ["Strategic Games", "Tracking Games"],
        'priority': 10,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Minesweeper",
        'description': "A game where you need find all the bombs",
        'owner': "panda22",
        'icon': "minesweeper.png",
        'tags': ["Strategic Games", "Puzzle Games"],
        'priority': 10,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Snake",
        'description': "A game where you need to get the longest snake possible without crashing",
        'owner': "panda22",
        'icon': "snake.png",
        'tags': ["Strategic Games", "Puzzle Games"],
        'priority': 85,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Simon Says",
        'description': "A game where you need to memorise the pattern",
        'owner': "giraffe10",
        'icon': "simon.png",
        'tags': ["Memory Games", "Pattern Recognition Games"],
        'priority': 95,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Frog Road",
        'description': "A game where you need to get the frog as far across the road as possible",
        'owner': "panda22",
        'icon': "frog.png",
        'tags': ["Timing Games", "Reflex Games", "High AI Score"],
        'priority': 60,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Spelling",
        'description': "A game where you need to find the word spelled incorrectly the quickest",
        'owner': "lion589",
        'icon': "spelling.png",
        'tags': ["Pattern Recognition Games", "Problem Solving Games"],
        'priority': 5,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Connections",
        'description': "A game where you need to find the four sets of connections between a set of words",
        'owner': "duck44",
        'icon': "connections.png",
        'tags': ["Pattern Recognition Games", "High Human Player Score"],
        'priority': 100,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Words",
        'description': "A game where you need to find the most words with the given letters",
        'owner': "lion589",
        'icon': "words.png",
        'tags': ["Pattern Recognition Games", "Problem Solving Games"],
        'priority': 20,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
    },
    {
        'name': "Wordsearch",
        'description': "A game where you need to solve the wordsearch the quickest",
        'owner': "lion589",
        'icon': "wordsearch.png",
        'tags': ["Puzzle Games", "Problem Solving Games"],
        'priority': 10,
        'evaluation': 'ex_coins.py',
        'score_type': {
            'headers': [
                {
                    'name': 'Coins',
                    'type': 'int',
                    'min': 0,
                    'max': 100,
                }
            ]
        },
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
        'name': 'Zebra Bot',
        'is_ai': True,
        'user': 'zebra777',
        'description': 'AI player that is owned by zebra777',
        'tags': ["High Puzzle Performance", "High Reflex Performance"],
        'icon': "zebra.png",
    },
    {
        'name': 'Monkey Bot',
        'is_ai': True,
        'user': 'monkey555',
        'description': 'AI player that is owned by monkey555',
        'tags': ["High Memory Performance", "High Timing Performance"],
        'icon': "monkey.png",
    },
    {
        'name': 'Tiger Bot',
        'is_ai': True,
        'user': 'tiger321',
        'description': 'AI player that is owned by tiger321',
        'tags': ["High Problem Solving Performance", "High Strategic Performance"],
        'icon': "tiger.png",
    },
    {
        'name': 'Elephant Bot',
        'is_ai': True,
        'user': 'elephant456',
        'description': 'AI player that is owned by elephant456',
        'tags': ["High Problem Pattern Recognition Performance", "High Judgement Performance"],
        'icon': "elephant.png",
    },
]


def add_random_score(game: Game, player_list):
    player = random.choice(player_list)
    score = {}

    for header in game.score_type['headers']:
        mini = header.get('min', 0)
        maxi = header.get('max', 1000)
        if header['type'] == 'int':
            val = random.randint(mini, maxi)
        else:
            val = random.uniform(mini, maxi)

        score[header['name']] = val

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

    player = Player.objects.get_or_create(name=data['username'], is_ai=False,
                                          user=user, description="Human player of " + data['username'])[0]
    if 'icon' in data:
        player.icon.name = add_media_from_static(USER_ICON_SUBDIR, data['icon'])

    player.save()

    user.save()
    userStatus = UserStatus.objects.get_or_create(user=user)

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
    game.score_type = data['score_type']
    game.description = data.get('description', "no description")
    game.priority = data['priority']

    if 'icon' in data:
        game.icon.name = add_media_from_static(Game.ICON_SUBDIR, data['icon'])

    if 'evaluation' in data:
        game.evaluation_script.name = add_media_from_static(
            Game.EVALUATION_SUBDIR, data['evaluation'])

    for tag_name in data.get('tags', []):
        try:
            tag = GameTag.objects.get(name=tag_name)
        except GameTag.DoesNotExist:
            tag = add_game_tag(
                {'name': tag_name, 'description': 'Default description'})

        game.tags.add(tag)

    game.save()

    # adding some random scores to this game
    for _ in range(random.randint(10, 20)):
        add_random_score(game, Player.objects.filter(is_ai=1))
        add_random_score(game, Player.objects.filter(is_ai=0))

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
            tag = add_player_tag(
                {'name': tag_name, 'description': 'Default description'})

        player.tags.add(tag)

    if data["icon"]:
        player.icon.name = add_media_from_static(PLAYER_ICON_SUBDIR, data['icon'])
    player.save()

    return player


def populate():
    """Populate the database with example data"""

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
