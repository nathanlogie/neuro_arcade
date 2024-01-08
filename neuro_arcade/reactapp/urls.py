from django.urls import path

from . import views


app_name = 'reactapp'

urlpatterns = [
    path('react_test', views.react_test, name='react_index'),
]
