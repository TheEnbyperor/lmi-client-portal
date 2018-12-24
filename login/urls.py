from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('auth/<token>', views.auth, name='auth')
]
app_name = 'login'