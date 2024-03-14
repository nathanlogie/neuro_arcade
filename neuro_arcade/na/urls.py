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
    path('ping/', views.ping, name='ping'),
    # authentication
    path('login/', views.login, name='login'),
    path('sign-up/', views.sign_up, name='sign_up'),
    path('csrf/', views.csrf, name='csrf'),
    # games
    path('games/<slug:game_name_slug>/data/', views.get_game, name='get_game'),
    path('games/<slug:game_name_slug>/add-score/', views.post_game_score, name='post_game_score'),
    path('games/<slug:game_name_slug>/update/', views.update_game, name='update_game'),
    path('create-game/', views.post_new_game, name='post_new_game'),
    path('get-games/', views.get_games_sorted, name='get_games'),
    path('get-my-games/', views.get_games_for_logged_in_user, name='get_games_for_logged_in_user'),
    # tags
    path('tags/', views.get_tags, name='get_tags'),
    # about page
    path('about/', views.get_about_data, name='get_about_data'),
    path('edit-about/', views.post_about_data, name='update_about_json'),
    # players
    path('players/<slug:player_name_slug>/data/', views.get_player, name='get_player'),
    path('players/<slug:player_name_slug>/update_player/', views.update_player, name='update_player'),
    path('create-player/', views.post_new_player, name='create_player'),
    path('delete-player/', views.delete_player, name='delete_player'),
    path('get-human-player/', views.get_human_player_for_logged_in_user, name='get_human_player_for_logged_in_user'),
    path('get-my-players/', views.get_players_for_logged_in_user, name='get_players_for_logged_in_user'),
    path('player-rankings/', views.get_player_rankings, name='get_player_rankings'),
    path('users/<user_id>/players/', views.get_user_players, name='get_user_players'),
    path('players/<slug:player_name_slug>/score/', views.get_player_scores, name='player_scores'),
    # unprocessed results
    path('upload/unprocessed-result/', views.post_unprocessed_result, name='post_unprocessed_result'),
    # admin
    path('update-status/', views.update_user_status, name='update_user_status'),
    path('get-all-users/', views.get_all_users, name='get_all_users'),
    path('post-admin-ranking/', views.post_admin_ranking, name='post_admin_ranking'),
    # View Sets:
    path('', include(router.urls)),
]
