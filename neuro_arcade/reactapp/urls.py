from django.urls import path

from . import views


app_name = 'reactapp'

urlpatterns = [
    path('', views.react_index, name='react_index'),
]
