from django.shortcuts import render, get_object_or_404
from django.template.loader import render_to_string
from login.decorators import requires_login
from django.core.exceptions import PermissionDenied
import json
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
