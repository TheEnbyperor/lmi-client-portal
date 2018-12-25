from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='dashboard'),
]
app_name = 'main_site'
