from django.urls import path

from na import views
from rest_framework.authtoken import views as rest_views


app_name = 'na'

urlpatterns = [
    path(
        'login/',
        rest_views.obtain_auth_token,
        name='login'),
    path(
        'sign_up/',
        views.sign_up,
        name='sign_up'),
    path(
        'games/<slug:game_name_slug>/data/',
        views.get_game,
        name='get_game'),
    path(
        'games/<slug:game_name_slug>/add_score/',
        views.post_game_score,
        name='post_game_score'),
    path(
        'tags/',
        views.get_tags,
        name='get_tags'),
    path(
        'get_games/',
        views.get_games_sorted,
        name='get_games'),
    path(
        'about/',
        views.get_about_data,
        name='get_about_data'),
    path(
        'edit_about',
        views.post_about_data,
        name='update_about_json'),
]
