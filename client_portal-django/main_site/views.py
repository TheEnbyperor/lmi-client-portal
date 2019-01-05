from django.shortcuts import render
from login.decorators import requires_login
import document_signing.views


@requires_login
def index(request):
    return render(request, "main_site/dashboard.html", {
        "document_signing": document_signing.views.dashboard(request),
        "menu_item": "dashboard",
    })
