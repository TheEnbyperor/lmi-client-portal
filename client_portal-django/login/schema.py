import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType, ObjectType
from . import models
from . import login


class LoginState(graphene.Enum):
    INVALID_EMAIL = 1
    EMAIL_SENT = 2
    EMAIL_SEND_FAIL = 3
    AUTHENTICATED = 4
    INVALID_TOKEN = 5


class UserType(DjangoObjectType):
    class Meta:
        model = models.User
        exclude_fields = ('login_token', 'login_token_generated')
        interfaces = (relay.Node,)


class LoginRequestResponseType(ObjectType):
    login_status = graphene.NonNull(LoginState)
    login_status_token = graphene.String()


class Query:
    whoami = graphene.Field(UserType)

    request_login = graphene.NonNull(LoginRequestResponseType, email=graphene.NonNull(graphene.String))
    login_status = graphene.NonNull(LoginRequestResponseType, status_token=graphene.NonNull(graphene.String))

    def resolve_whoami(self, info):
        return login.get_request_user(info.context)

    def resolve_request_login(self, info, email):
        return login.start_login_flow(email, info.context)

    def resolve_login_status(self, info, status_token):
        return login.get_login_flow_status(status_token, info.context)
