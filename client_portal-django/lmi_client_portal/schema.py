import graphene
import login.schema


class Query(login.schema.Query, graphene.ObjectType):
    pass


class Mutation(login.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
