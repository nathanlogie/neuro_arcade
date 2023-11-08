from django.contrib import admin

from na.models import GameTag, Game, Player, PlayerTag, Score, ScoreField, ScoreFieldType, ScoreType

# Register your models here.

admin.site.register(GameTag)
admin.site.register(Game)
admin.site.register(Player)
admin.site.register(PlayerTag)
admin.site.register(ScoreFieldType)
admin.site.register(ScoreField)
admin.site.register(ScoreType)
admin.site.register(Score)
