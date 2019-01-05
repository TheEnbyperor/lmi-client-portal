from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<doc_id>', views.view_document, name='view_document'),
    path('<doc_id>/file', views.get_document_file, name='get_document_file'),
]
app_name = 'document_signing'
