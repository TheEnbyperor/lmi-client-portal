import datetime
import secrets
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import send_mail
from . import models
from . import schema


def get_request_user(request):
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


def start_login_flow(email, request):
    try:
        user = models.User.objects.get(email=email)
    except models.User.DoesNotExist:
        return schema.LoginRequestResponseType(login_status=schema.LoginState.INVALID_EMAIL)

    auth_token = secrets.token_urlsafe(128)
    status_token = secrets.token_urlsafe(128)
    link = request.build_absolute_uri(reverse('login:auth', kwargs={"token": auth_token}))
    base = f'{request.scheme}://{request.get_host()}/'

    email_context = {"link": link, "base": base}
    email_html = render_to_string("login/login_email.html", email_context, request)
    email_text = render_to_string("login/login_email_text.html", email_context, request)

    email_status = send_mail(
        'Louise Misell Interiors login',
        email_text,
        'Louise Misell Interiors <noreply@noreply.louisemisellinteriors.co.uk>',
        [user.email],
        html_message=email_html,
        fail_silently=True,
    )

    if email_status < 1:
        return schema.LoginRequestResponseType(login_status=schema.LoginState.EMAIL_SEND_FAIL)

    user.login_token = auth_token
    user.login_status_token = status_token
    user.login_token_authenticated = False
    user.login_token_generated = datetime.datetime.now(datetime.timezone.utc)
    user.save()

    return schema.LoginRequestResponseType(login_status=schema.LoginState.EMAIL_SENT, login_status_token=status_token)


def get_login_flow_status(token, request):
    try:
        user = models.User.objects.get(login_status_token=token)
    except models.User.DoesNotExist:
        return schema.LoginRequestResponseType(login_status=schema.LoginState.INVALID_TOKEN)

    if datetime.datetime.now(datetime.timezone.utc) - user.login_token_generated > datetime.timedelta(minutes=60):
        return schema.LoginRequestResponseType(login_status=schema.LoginState.INVALID_TOKEN)

    if not user.login_token_authenticated:
        return schema.LoginRequestResponseType(login_status=schema.LoginState.EMAIL_SENT)

    request.session.flush()
    request.session.set_expiry(60 * 60 * 24 * 365 * 100)
    request.session['user_id'] = user.id
    request.session['last_touch'] = datetime.datetime.now(datetime.timezone.utc)
    user.login_status_token = None
    user.login_token_generated = None
    user.login_token_authenticated = False
    user.save()

    return schema.LoginRequestResponseType(login_status=schema.LoginState.AUTHENTICATED)
