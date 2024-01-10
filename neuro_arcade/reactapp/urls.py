from django.urls import path

from . import views


app_name = 'reactapp'

urlpatterns = [
    path('react_test/', views.react_test, name='react_index'),
    path('react_test/api/', views.fibbonaci, name='api_test')
]
