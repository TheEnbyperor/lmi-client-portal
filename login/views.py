from django.shortcuts import render
from django.template.loader import render_to_string
from django.urls import reverse
from . import models
import secrets


def index(request):
    if request.method == "POST":
        email = request.POST["email"].strip()

        try:
            user = models.User.objects.get(email=email)
        except models.User.DoesNotExist:
            return render(request, "login/login_form.html", {"error": "That email isn't registered. Please try again."})

        token = secrets.token_urlsafe(128)
        link = request.build_absolute_uri(reverse('login:auth', kwargs={"token": token}))

        base = f'{request.scheme}://{request.get_host()}/'

        email = render_to_string("login/login_email.html", {"link": link, "base": base}, request)
        print(email)

        return render(request, "login/login_form.html",
                      {"message": "Sent! Go check your email. Remember it may be in spam."})

    return render(request, "login/login_form.html")


def auth(request, token):
    pass
