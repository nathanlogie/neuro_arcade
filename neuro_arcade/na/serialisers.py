from rest_framework import serializers

class GameSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = ['name', 'description', 'icon', 'tags', 'score_type', 'play_link', 'evaluation_script']