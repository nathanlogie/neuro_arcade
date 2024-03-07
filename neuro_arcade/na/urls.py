from django.urls import path, include

from na import views
from na.views import GameViewSet, UserViewSet, GameTagViewSet, PlayerViewSet, PlayerTagViewSet
from rest_framework import routers


app_name = 'na'

router = routers.DefaultRouter()
router.register(r'games', GameViewSet)
router.register(r'users', UserViewSet)
router.register(r'gameTag', GameTagViewSet)
router.register(r'players', PlayerViewSet)
router.register(r'playerTag', PlayerTagViewSet)

urlpatterns = [
    path('login/', views.login, name='login'),
    path('sign-up/', views.sign_up, name='sign_up'),
    path('games/<slug:game_name_slug>/data/', views.get_game, name='get_game'),
    path('games/<slug:game_name_slug>/add_score/', views.post_game_score, name='post_game_score'),
    path('tags/', views.get_tags, name='get_tags'),
    path('get-games/', views.get_games_sorted, name='get_games'),
    path('about/', views.get_about_data, name='get_about_data'),
    path('edit_about/', views.post_about_data, name='update_about_json'),
    path('create_player/', views.post_new_player, name='create_player'),
    path('delete_player/', views.delete_player, name='delete_player'),
    path('csrf/', views.csrf, name='csrf'),
    path('ping/', views.ping, name='ping'),
    path('player_rankings/', views.get_player_rankings, name='get_player_rankings'),
    path('upload/unprocessed_result/', views.post_unprocessed_result, name='post_unprocessed_result'),
    path('players/<slug:player_name_slug>/data/', views.get_player, name='get_player'),
    path('update_status/', views.update_user_status, name='update_user_status'),
    path('post_admin_ranking/', views.post_admin_ranking, name='post_admin_ranking'),
    path('players/<slug:player_name_slug>/score/', views.get_player_scores, name='player_scores'),
    path('users/<user_id>/players/', views.get_user_players, name='get_user_players'),
    # View Sets:
    path('api/', include(router.urls)),
]
