from django.urls import path

from na import views


app_name = 'na'

urlpatterns = [
    path('', views.index, name='index'),
    path('games/', views.game_search, name='game_search'),
    path('games/<slug:game_name_slug>/', views.game_view, name='game_view'),
    path('games/<slug:game_name_slug>/add_data/', views.game_data_add, name='game_data_add'),
    path('games/<slug:game_name_slug>/data/', views.get_game, name='get_game'),
    path('games/<slug:game_name_slug>/add_score/', views.post_game_score, name='post_game_score'),
    path('add_content/', views.content_add, name='content_add'),
    path('add_game/', views.game_add, name='game_add'),
    path('models/<slug:model_name_slug>/', views.player_view, name='model_view'),
    path('add_model/', views.model_add, name='model_add'),
    path('logout/', views.logout, name='logout'),
    path('login/', views.login, name='login'),
    path('sign_up/', views.sign_up, name='sign_up'),
    path('about/', views.about, name='about'),
    path('about/edit_about/', views.edit_about, name='edit_about'),
]
