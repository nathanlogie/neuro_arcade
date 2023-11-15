from django.contrib import admin

from na.models import GameTag, Game, Player, PlayerTag, ScoreRow, ScoreField, ScoreColumn, ScoreTable

# Register your models here.

admin.site.register(GameTag)
admin.site.register(Game)
admin.site.register(Player)
admin.site.register(PlayerTag)
admin.site.register(ScoreColumn)
admin.site.register(ScoreField)
admin.site.register(ScoreTable)
admin.site.register(ScoreRow)
