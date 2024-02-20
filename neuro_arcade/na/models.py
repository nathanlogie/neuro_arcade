from enum import Enum
from typing import Any, Dict, Iterable, List, Literal, Optional, Tuple, TypedDict, Union

from django.contrib.auth.models import User
from django.db import models
from django.template.defaultfilters import slugify


MAX_SCORE_VALUE_SIZE = 256


# functions for setting default fields:
def default_score_type():
    return {"headers": []}


def default_score():
    return []


class GameTag(models.Model):
    """Category for a game. """

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    slug = models.SlugField(unique=True)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(GameTag, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class ScoreHeader(TypedDict):
    """Definition of one type of score a game supports"""

    name: str
    type: Literal['int', 'float']

    # If present, their types must match the value of type
    min: Optional[Union[int, float]]
    max: Optional[Union[int, float]]


class ScoreType(TypedDict):
    """Definition of the types of score a game supports"""

    headers: List[ScoreHeader]


def validate_score_header(header: Any) -> Tuple[bool, Optional[str]]:
    """Takes an object parsed from json and checks it's a valid score type
    
    Returns whether the test passed, and the error message if not"""

    # While header is expected to be a ScoreHeader, it could be any object
    # parsed from json so that can't actually be assumed

    # Should be a dict
    if not isinstance(header, dict):
        return False, "Header should be a dictionary"

    # Keys should be subset of pre-defined keys
    valid_keys = {'name', 'type', 'min', 'max'}
    for key in header.keys():
        if key not in valid_keys:
            return False, f"Invalid field name '{key}' - should be 'name', 'type', 'min' or 'max'"

    # Name should exist and be a string
    if 'name' not in header:
        return False, "Field 'name' is required"
    if not isinstance(header['name'], str):
        return False, "Field 'name' should be a string"
    
    # Type should be integer or float
    if 'type' not in header:
        return False, "Field 'type' is required"
    if header['type'] not in (Game.SCORE_FLOAT, Game.SCORE_INT):
        return False, f"Invalid value for field 'type' - should be integer or float"

    data_type = int if header['type'] == Game.SCORE_INT else float
    
    # Min and max should match type if they exist
    if 'min' in header:
        if not isinstance(header['min'], data_type):
            return False, f"Invalid value for field 'min' - should be of type {header['type']}"
    if 'max' in header:
        if not isinstance(header['max'], data_type):
            return False, f"Invalid value for field 'max' - should be of type {header['type']}"

    # Min should be less than max if both present
    if 'min' in header and 'max' in header:
        if header['min'] >= header['max']:
            return False, "Field 'min' should be less than field 'max'"

    return True, None


def validate_score_type(score_type: Any) -> Tuple[bool, Optional[str]]:
    """Takes an object parsed from json and checks it's a valid score type
    
    Returns whether the test passed, and the error message if not"""

    # While score_type is expected to be a ScoreType, it could be any object
    # parsed from json so that can't actually be assumed

    # Should be a dict
    if not isinstance(score_type, dict):
        return False, "Score type should be a dictionary"

    # Only root element should be headers
    for key in score_type:
        if key != 'headers':
            return False, f"Invalid field name '{key}', only field should be 'headers'"
    if 'headers' not in score_type:
        return False, "Field 'headers' is required"

    # Headers should be a list
    if not isinstance(score_type['headers'], list):
        return False, "Headers should be a list"

    # TODO: require at least 1 header?

    # Headers should be valid
    for i, d in enumerate(score_type['headers']):
        passed, msg = validate_score_header(d)
        if not passed:
            return False, f"Error in header {i+1}: {msg}"
    
    return True, None


def validate_score(score_type: ScoreType, score: Any) -> Tuple[bool, Optional[str]]:
    """Takes an object parsed from json and checks it's a valid score for its type
    Assumes score_type is already valid

    Returns whether the test passed, and the error message if not"""

    # Should be a dict
    if not isinstance(score, dict):
        return False, "Score should be a dictionary"

    # All values should be defined in the score type
    name_set = {header['name'] for header in score_type['headers']}
    for key in score:
        if key not in name_set:
            return False, f"Field '{key}' should not exist"

    # All defined headers should have values in range
    for header in score_type['headers']:
        value = score.get(header['name'])

        if value is None:
            return False, f"Field '{header['name']}' is required"

        if (
            ('min' in header and header['min'] > value)
            or ('max' in header and header['max'] < value)
        ):
            return False, f"Field '{header['name']}' out of range"

    return True, None


class Game(models.Model):
    """Description of a game added to the website. """

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    ICON_SUBDIR = 'game_icons'
    EVALUATION_SUBDIR = 'evaluation_functions'

    SCORE_INT = "int"
    SCORE_FLOAT = "float"

    SCORE_DATATYPES = [
        (SCORE_INT, "Integer"),
        (SCORE_FLOAT, "Float"),
    ]

    DEFAULT_PRIORITY = 0

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    slug = models.SlugField(unique=True)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    icon = models.ImageField(upload_to=ICON_SUBDIR, blank=True)
    tags = models.ManyToManyField(GameTag, blank=True)
    score_type: ScoreType = models.JSONField(default=default_score_type)
    play_link = models.URLField()
    evaluation_script = models.FileField(upload_to=EVALUATION_SUBDIR)
    priority = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Game, self).save(*args, **kwargs)

    def matches_search(self, query: Optional[str], tags: Optional[Iterable[GameTag]]) -> bool:
        accept = True

        # Check tags
        if tags is not None:
            for tag in tags:
                if not self.tags.contains(tag):
                    accept = False

        # Check query in name and description
        if query is not None:
            lower = query.lower()
            if lower not in self.name.lower() and lower not in self.description.lower():
                accept = False

        return accept

    def get_score_table(self):
        try:
            headers = self.score_type['headers']
            score_objs = self.score_set.all()
            scores = []

            for score in score_objs:
                s = [score.score[header['name']] for header in headers]
                scores.append({
                    'player_name': score.player.name,
                    'is_ai': score.player.is_ai,
                    'score': s
                })

            return headers, scores

        except TypeError:  # this can happen if score_type is not populated
            print("[WARN] Something went wrong when trying to get the scores for ", self)
            print("[WARN]  This might happen if score_type is not populated.")
            return None, None

    def get_highest_scores(self) -> Dict[str, List["Score"]]:
        """
        Gets the highest recorded score for each player for each score type in this game.

        Should probably be optimised to run at intervals and cache results in the future.
        """

        ret = {}

        scores = self.score_set.all()
        for header in self.score_type['headers']:
            name = header['name']

            # Sort by this score
            ranked: List[Score] = sorted(scores, key=lambda s: -s.score[name])

            # Filter to just the highest score for each player
            filtered = []
            player_set = set()
            for score in ranked:
                if score.player not in player_set:
                    filtered.append(score)
                    player_set.add(score.player)

            ret[name] = filtered

        return ret

    def __str__(self):
        return self.name


class PlayerTag(models.Model):
    """A category of Player. Mostly used for AI players. """

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    slug = models.SlugField(unique=True)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(PlayerTag, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Player(models.Model):
    """An entity that can appear on a scoreboard, human or AI.

     Players have an `owner` user.

     The `is_ai` field decides whenever a player is a human or an AI. """

    MAX_PLAYER_NAME_LENGTH = 64
    MAX_PLAYER_DESCRIPTION_LENGTH = 1024

    name = models.CharField(max_length=MAX_PLAYER_NAME_LENGTH)
    slug = models.SlugField(unique=True, null=True)
    is_ai = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    description = models.TextField(max_length=MAX_PLAYER_DESCRIPTION_LENGTH, default='')
    tags = models.ManyToManyField(PlayerTag, blank=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Player, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Score(models.Model):
    """Scores. """

    score = models.JSONField(default=default_score) # map of name: value
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)

    def __str__(self):
        return self.player.name + "'s score at " + self.game.name


class UserStatus(models.Model):
    """ Status of users
    Can be approved, blocked or pending """

    STATUS_OPTIONS = [
        ("approved", "Approved"),
        ("blocked", "Blocked"),
        ("pending", "Pending")
    ]

    status = models.CharField(max_length=10, choices=STATUS_OPTIONS, default="pending")
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="status")

    def __str__(self):
        return "Status of " + self.user.username + ": " + self.status
