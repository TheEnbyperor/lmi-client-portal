from django.urls import path
from . import views

urlpatterns = [
    path('<doc_id>/file', views.get_document_file, name='get_document_file'),
]
app_name = 'document_signing'
