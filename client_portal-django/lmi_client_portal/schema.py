import graphene
import login.schema
import document_signing.schema


class Query(login.schema.Query, document_signing.schema.Query, graphene.ObjectType):
    pass


class Mutation(login.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
