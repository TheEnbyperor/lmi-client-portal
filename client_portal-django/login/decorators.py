from django.core.exceptions import PermissionDenied
from . import models
import datetime


def get_authenticated_user(request):
    request.session.clear_expired()

    user_id = request.session.get('user_id', None)
    last_touch = request.session.get('last_touch', None)
    if last_touch is None or user_id is None:
        return None

    try:
        user = models.User.objects.get(id=user_id)
    except models.User.DoesNotExist:
        return None

    if datetime.datetime.now(datetime.timezone.utc) - last_touch > datetime.timedelta(hours=1):
        del request.session['last_touch']
        del request.session['user_id']
        return None

    request.session['last_touch'] = datetime.datetime.now(datetime.timezone.utc)

    return user