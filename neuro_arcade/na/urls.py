from django.urls import path

from na import views


app_name = 'na'

urlpatterns = [
    path('', views.index, name='index'),
    path('games/', views.game_search, name='game_search'),
    path('games/<slug:game_name_slug>/', views.game_view, name='game_view'),
    path('games/<slug:game_name_slug>/add_data/', views.game_data_add, name='game_data_add'),
    path('add_game/', views.game_add, name='game_add'),
    path('models/<slug:model_name_slug>/', views.model_view, name='model_view'),
    path('add_model/', views.model_add, name='model_add'),
]
