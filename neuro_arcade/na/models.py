from typing import Iterable, Optional

from django.contrib.auth.models import User
from django.db import models
from django.template.defaultfilters import slugify


MAX_SCORE_VALUE_SIZE = 256

class GameTag(models.Model):
    """Category for a game"""

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    slug = models.SlugField(unique=True)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(GameTag, self).save(*args, **kwargs)


class Game(models.Model):
    """Description of a game added to the website"""

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    MEDIA_SUBDIR = 'game_icons'

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    slug = models.SlugField(unique=True)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    icon = models.ImageField(upload_to=MEDIA_SUBDIR, blank=True)
    tags = models.ManyToManyField(GameTag)
    score_type = models.CharField(max_length=MAX_SCORE_VALUE_SIZE)

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


class Player(models.Model):
    """An entity that can appear on a scoreboard, human or AI
    
    AI players will also have an AI instance linked to it"""

    # todo: maybe this should be unified with AI more?
    #  the fields for a human player and an AI player shouldn't be much different
    MAX_NAME_LENGTH = 64

    name = models.CharField(max_length=MAX_NAME_LENGTH)


class AITag(models.Model):
    """A category of AI"""

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)


class AI(models.Model):
    """An AI model being evaluated by games on the site"""

    MAX_DESCRIPTION_LENGTH = 1024

    player = models.OneToOneField(Player, on_delete=models.CASCADE)
    slug = models.SlugField(unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.player.name)
        super(AI, self).save(*args, **kwargs)


class UserInfo(models.Model):
    """Project specific user info"""

    player = models.OneToOneField(Player, on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class ScoreType(models.Model):
    """Definition of the type of score returned by an evaluation script"""

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    MEDIA_SUBDIR = 'evaluation_functions'

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    description = models.CharField(max_length=MAX_DESCRIPTION_LENGTH)
    code = models.FileField(upload_to=MEDIA_SUBDIR)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)


class ScoreFieldType(models.Model):
    """Definition of a field of a score in an evaluation script"""

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    group = models.ForeignKey(ScoreType, on_delete=models.CASCADE)
    name = models.CharField(max_length=MAX_NAME_LENGTH)
    description = models.CharField(max_length=MAX_DESCRIPTION_LENGTH)
    min = models.IntegerField(null=True)
    max = models.IntegerField(null=True)


class Score(models.Model):
    """A single set of values for a ScoreType"""

    group = models.ForeignKey(ScoreType, on_delete=models.CASCADE)
    time = models.DateTimeField()


class ScoreField(models.Model):
    """A single value for a ScoreFieldType in a score"""

    group = models.ForeignKey(Score, on_delete=models.CASCADE)
    type = models.ForeignKey(ScoreFieldType, on_delete=models.CASCADE)
    value = models.IntegerField()
