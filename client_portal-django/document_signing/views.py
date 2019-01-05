from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.template.loader import render_to_string
from login.decorators import requires_login
from django.core.exceptions import PermissionDenied
from django.views.static import serve
import login.models
import json
import datetime
from . import models


def dashboard(request):
    documents = models.Document.objects.filter(assignees=request.user)
    return render_to_string("document_signing/dashboard.html", {"documents": documents}, request)


@requires_login
def index(request):
    documents = models.Document.objects.filter(assignees=request.user)
    return render(request, "document_signing/index.html", {"documents": documents, "menu_item": "document_signing"})


@requires_login
def view_document(request, doc_id):
    document = get_object_or_404(models.Document, id=doc_id)

    if len(document.assignees.filter(document__assignees=request.user)) < 1:
        raise PermissionDenied

    document_data = json.dumps({
        "areas": list(map(lambda a: {
            "id": a.id,
            "type": a.type,
            "top": a.top,
            "bottom": a.bottom,
            "left": a.left,
            "right": a.right,
        }, document.documentarea_set.all()))
    })

    return render(request, "document_signing/view_document.html", {"document": document, "document_data": document_data,
                                                                   "menu_item": "document_signing"})


def get_document_file(request, doc_id):
    request.session.clear_expired()

    user_id = request.session.get('user_id', None)
    last_touch = request.session.get('last_touch', None)
    if last_touch is None or user_id is None:
        raise PermissionDenied

    try:
        user = login.models.User.objects.get(id=user_id)
    except login.models.User.DoesNotExist:
        raise PermissionDenied

    if datetime.datetime.now(datetime.timezone.utc) - last_touch > datetime.timedelta(hours=1):
        del request.session['last_touch']
        del request.session['user_id']
        raise PermissionDenied

    document = get_object_or_404(models.Document, id=doc_id)

    if len(document.assignees.filter(document__assignees=user)) < 1:
        raise PermissionDenied

    return serve(request, document.document.name, settings.MEDIA_ROOT, False)
