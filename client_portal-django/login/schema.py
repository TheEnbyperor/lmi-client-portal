import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType
from . import models
from . import login


class UserType(DjangoObjectType):
    class Meta:
        model = models.User
        exclude_fields = ('login_token', 'login_token_generated')
        interfaces = (relay.Node,)


class Query:
    whoami = graphene.Field(UserType)

    def resolve_whoami(self, info):
        return login.get_request_user(info.context)
