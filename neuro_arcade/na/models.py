from django.db import models

# Create your models here.

class GameTag(models.Model):
    """Category for a game"""

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)


class Game(models.Model):
    """Description of a game added to the website"""

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    MEDIA_SUBDIR = 'game_icons'

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)
    icon = models.ImageField(upload_to=MEDIA_SUBDIR)
    tags = models.ManyToManyField(GameTag)


class Player(models.Model):
    """An entity that can appear on a scoreboard, human or AI
    
    AI players will also have an AI instance linked to it"""

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
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)


class ScoreType(models.Model):
    """A category of score for a game"""

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    MEDIA_SUBDIR = 'evaluation_functions'

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)
    code = models.FileField(upload_to=MEDIA_SUBDIR)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)


class Score(models.Model):
    """A result of a player playing a game"""

    t = models.ForeignKey(ScoreType, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    value = models.IntegerField() # TODO: does this need to be a float?

