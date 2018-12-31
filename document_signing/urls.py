from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<doc_id>', views.view_document, name='view_document'),
]
app_name = 'document_signing'
