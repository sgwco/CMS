import { GraphQLObjectType } from 'graphql';
import { Query as UserQuery, Mutation as UserMutation } from './user';
import MediaResolver from './media';
import PostResolver from './post';
import CategoryResolver from './category';

export const Query = new GraphQLObjectType({
  name: 'SGW_Queries',
  fields: {
    ...UserQuery,
    ...MediaResolver,
    ...PostResolver,
    ...CategoryResolver
  }
});

export const Mutation = new GraphQLObjectType({
  name: 'SGW_Mutations',
  fields: {
    ...UserMutation
  }
});