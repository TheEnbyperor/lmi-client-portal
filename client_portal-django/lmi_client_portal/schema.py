import graphene
import login.schema


class Query(login.schema.Query, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
