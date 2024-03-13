from django.urls import path, include

from na import views
from na.views import GameViewSet, GameTagViewSet, PlayerViewSet, PlayerTagViewSet
from rest_framework import routers


app_name = 'na'

router = routers.DefaultRouter()
router.register(r'games', GameViewSet)
router.register(r'gameTag', GameTagViewSet)
router.register(r'players', PlayerViewSet)
router.register(r'playerTag', PlayerTagViewSet)

urlpatterns = [
    path('login/', views.login, name='login'),
    path('sign-up/', views.sign_up, name='sign_up'),
    path('games/<slug:game_name_slug>/data/', views.get_game, name='get_game'),
    path('games/<slug:game_name_slug>/add-score/', views.post_game_score, name='post_game_score'),
    path('create-game/', views.post_new_game, name='post_new_game'),
    path('tags/', views.get_tags, name='get_tags'),
    path('get-games/', views.get_games_sorted, name='get_games'),
    path('about/', views.get_about_data, name='get_about_data'),
    path('edit-about/', views.post_about_data, name='update_about_json'),
    path('create-player/', views.post_new_player, name='create_player'),
    path('delete-player/', views.delete_player, name='delete_player'),
    # todo: replace _ with -
    path('get_human_player/', views.get_human_player_for_logged_in_user, name='get_human_player_for_logged_in_user'),
    path('get-players/', views.get_players_for_logged_in_user, name='get_players_for_logged_in_user'),
    path('get-games/', views.get_games_for_logged_in_user, name='get_games_for_logged_in_user'),
    path('csrf/', views.csrf, name='csrf'),
    path('ping/', views.ping, name='ping'),
    path('player-rankings/', views.get_player_rankings, name='get_player_rankings'),
    path('upload/unprocessed-result/', views.post_unprocessed_result, name='post_unprocessed_result'),
    path('players/<slug:player_name_slug>/data/', views.get_player, name='get_player'),
    path('update-status/', views.update_user_status, name='update_user_status'),
    path('post-admin-ranking/', views.post_admin_ranking, name='post_admin_ranking'),
    path('players/<slug:player_name_slug>/score/', views.get_player_scores, name='player_scores'),
    path('users/<user_id>/players/', views.get_user_players, name='get_user_players'),
    path('games/<slug:game_name_slug>/update_game/', views.update_game, name='update_game'),
    path('players/<slug:player_name_slug>/update_player/', views.update_player, name='update_player'),
    path('get-all-users/', views.get_all_users, name='get_all_users'),
    # View Sets:
    path('api/', include(router.urls)),
]
