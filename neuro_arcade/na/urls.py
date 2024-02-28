from django.urls import path

from na import views


app_name = 'na'

urlpatterns = [
    path('login/', views.login, name='login'),
    path('sign_up/', views.sign_up, name='sign_up'),
    path('games/<slug:game_name_slug>/data/', views.get_game, name='get_game'),
    path('games/<slug:game_name_slug>/add_score/', views.post_game_score, name='post_game_score'),
    path('tags/', views.get_tags, name='get_tags'),
    path('get_games/', views.get_games_sorted, name='get_games'),
    path('about/', views.get_about_data, name='get_about_data'),
    path('edit_about/', views.post_about_data, name='update_about_json'),
    path('create_player/', views.post_new_player, name='create_player'),
    path('delete_player/', views.delete_player, name='delete_player'),
    path('csrf/', views.csrf, name='csrf'),
    path('ping/', views.ping, name='ping'),
    path('model_rankings/', views.get_model_rankings, name='get_model_rankings'),
    path('players/<slug:player_name_slug>/data/', views.get_player, name='get_player'),
    path('update_status/', views.update_user_status, name='update_user_status'),
    path('post_admin_ranking/', views.post_admin_ranking, name='post_admin_ranking')
]
