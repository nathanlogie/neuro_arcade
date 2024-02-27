from rest_framework import serializers
from na.models import Game, GameTag, Player, PlayerTag, UserStatus, validate_score_type
from django.contrib.auth.models import User

class UserStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStatus
        fields = '__all__'

class UserSerializer(serializers.HyperlinkedModelSerializer):
    status = UserStatusSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'status']


class GameTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameTag
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    tags = GameTagSerializer(read_only=True, many=True).data

    def validate_score_type(self, data):
        passed, msg = validate_score_type(data)
        if not passed:
            raise serializers.ValidationError(msg)


    class Meta:
        model = Game
        fields = ['id', 'name', 'slug', 'description', 'owner', 'icon', 'tags', 'score_type', 'play_link',
                  'evaluation_script']


class PlayerTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerTag
        fields = ['id', 'name', 'slug', 'description']


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'name', 'slug', 'is_ai', 'user', 'description', 'tags', 'icon']
