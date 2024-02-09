from rest_framework import serializers
from na.models import Game, GameTag, Player, PlayerTag
from django.contrib.auth.models import User

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username']

class GameSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = ['url','name', 'description','owner','icon','tags', 'score_type', 'play_link', 'evaluation_script']

class GameTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GameTag
        fields = ['url', 'name', 'description']

class PlayerTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PlayerTag
        fields = ['url', 'name', 'description']

class PlayerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Player
        fields = ['url', 'name', 'slug', 'is_ai', 'user', 'description', 'tags']
