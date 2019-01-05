from django.shortcuts import render
from . import models
import datetime


def auth(request, token):
    try:
        user = models.User.objects.get(login_token=token)
    except models.User.DoesNotExist:
        return render(request, "login/login_form.html",
                      {"message": "This link is invalid. Only the most recent email we've sent you will work."})

    if datetime.datetime.now(datetime.timezone.utc) - user.login_token_generated > datetime.timedelta(minutes=60):
        return render(request, "login/login_form.html",
                      {"message": "That link has expired. Please close this tab, and request a new one in the "
                                  "client portal."})

    user.login_token = None
    user.login_token_authenticated = True
    user.save()

    return render(request, "login/login_form.html",
                  {"message": "Successfully authenticated! You may now close this tab, and return to the "
                              "client portal."})
