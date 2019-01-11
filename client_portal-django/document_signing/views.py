from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.views.static import serve
import login.decorators
from . import models


def get_document_file(request, doc_id):
    user = login.decorators.get_authenticated_user(request)

    if user is None:
        raise PermissionDenied

    document = get_object_or_404(models.Document, id=doc_id)

    if len(document.assignees.filter(document__assignees=user)) < 1:
        raise PermissionDenied

    return serve(request, document.document.name, settings.MEDIA_ROOT, False)
