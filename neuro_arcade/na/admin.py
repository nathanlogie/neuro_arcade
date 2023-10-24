from django.contrib import admin

from na.models import GameTag, Game, Player, AITag, AI, UserInfo, ScoreType, Score

# Register your models here.

admin.site.register(GameTag)
admin.site.register(Game)
admin.site.register(Player)
admin.site.register(AITag)
admin.site.register(AI)
admin.site.register(UserInfo)
admin.site.register(ScoreType)
admin.site.register(Score)
