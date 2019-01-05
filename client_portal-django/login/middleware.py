from . import models


def user_context(request):
    user = None
    user_id = request.session.get('user_id', None)
    if user_id is not None:
        try:
            user = models.User.objects.get(id=user_id)
        except models.User.DoesNotExist:
            pass
    return {
        "user": user
    }
