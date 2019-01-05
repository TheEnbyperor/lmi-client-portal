from django.shortcuts import render
from . import models
import datetime


def requires_login(view):
    def new_view(request, *args, **kwargs):
        request.session.clear_expired()

        user_id = request.session.get('user_id', None)
        last_touch = request.session.get('last_touch', None)
        if last_touch is None or user_id is None:
            return render(request, "login/login_form.html", {"error": "Your session has expired. Please login again.",
                                                             "redirect": request.get_full_path()})

        try:
            user = models.User.objects.get(id=user_id)
        except models.User.DoesNotExist:
            return render(request, "login/login_form.html", {"error": "Your session has expired. Please login again.",
                                                             "redirect": request.get_full_path()})

        if datetime.datetime.now(datetime.timezone.utc) - last_touch > datetime.timedelta(hours=1):
            del request.session['last_touch']
            del request.session['user_id']
            return render(request, "login/login_form.html", {"error": "Your session has expired. Please login again.",
                                                             "redirect": request.get_full_path()})

        request.session['last_touch'] = datetime.datetime.now(datetime.timezone.utc)
        request.user = user

        return view(request, *args, **kwargs)

    return new_view
