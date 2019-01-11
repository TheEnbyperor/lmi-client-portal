import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType, ObjectType
from . import models
import login.decorators


class DocumentType(DjangoObjectType):
    class Meta:
        model = models.Document
        interfaces = (relay.Node,)


class Query:
    documents = graphene.NonNull(graphene.List(graphene.NonNull(DocumentType)),signed=graphene.Boolean())

    def resolve_documents(self, info, **kwargs):
        user = login.decorators.get_authenticated_user(info.context)
        if not user:
            return []

        documents = models.Document.objects.filter(assignees=user.id)
        return documents