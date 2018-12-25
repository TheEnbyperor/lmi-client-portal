from django.shortcuts import render, redirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.core.mail import send_mail
from . import models
import secrets
import datetime
import urllib.parse


def index(request):
    if request.method == "POST":
        email = request.POST["email"].strip()
        redirect_url = request.POST.get("redirect", None)

        try:
            user = models.User.objects.get(email=email)
        except models.User.DoesNotExist:
            return render(request, "login/login_form.html", {"error": "That email isn't registered. Please try again.",
                                                             "redirect": redirect_url})

        token = secrets.token_urlsafe(128)
        link_params = {}
        if redirect_url is not None:
            link_params["redirect"] = redirect_url
        link_params = urllib.parse.urlencode(link_params)
        link = request.build_absolute_uri(reverse('login:auth', kwargs={"token": token}) + f"?{link_params}")
        base = f'{request.scheme}://{request.get_host()}/'

        user.login_token = token
        user.login_token_generated = datetime.datetime.now(datetime.timezone.utc)
        user.save()

        email_context = {"link": link, "base": base}
        email_html = render_to_string("login/login_email.html", email_context, request)
        email_text = render_to_string("login/login_email_text.html", email_context, request)

        send_mail(
            'Louise Misell Interiors login',
            email_text,
            'Louise Misell Interiors <noreply@noreply.louisemisellinteriors.co.uk>',
            [user.email],
            html_message=email_html
        )

        return render(request, "login/login_form.html",
                      {"message": "Sent! Go check your email. Remember it may be in spam."})

    return render(request, "login/login_form.html")


def auth(request, token):
    redirect_url = request.GET.get("redirect", None)
    try:
        user = models.User.objects.get(login_token=token)
    except models.User.DoesNotExist:
        return render(request, "login/login_form.html",
                      {"error": "This link is invalid. Only the most recent email we've sent you will work.",
                       "redirect": redirect_url})

    if datetime.datetime.now(datetime.timezone.utc) - user.login_token_generated > datetime.timedelta(minutes=60):
        return render(request, "login/login_form.html", {"error": "That link has expired. Please request a new one.",
                                                         "redirect": redirect_url})

    user.login_token = None
    user.login_token_generated = None
    user.save()

    request.session.flush()
    request.session.set_expiry(60 * 60 * 24 * 365)
    request.session['user_id'] = user.id
    request.session['last_touch'] = datetime.datetime.now(datetime.timezone.utc)

    if redirect_url is not None:
        return redirect(redirect_url)
    return redirect('/')
