from django.shortcuts import render
from django.template.loader import render_to_string
from django.urls import reverse
from django.core.mail import send_mail
from . import models
import secrets
import datetime


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

        user.login_token = token
        user.login_token_generated = datetime.datetime.now()
        user.save()

        email_context = {"link": link, "base": base}
        email_html = render_to_string("login/login_email.html", email_context, request)
        email_text = render_to_string("login/login_email_text.html", email_context, request)

        send_mail(
            'Louise Misell Interiors login',
            email_text,
            'noreply@noreply.louisemisellinteriors.co.uk',
            [user.email],
            html_message=email_html
        )

        return render(request, "login/login_form.html",
                      {"message": "Sent! Go check your email. Remember it may be in spam."})

    return render(request, "login/login_form.html")


def auth(request, token):
    pass
