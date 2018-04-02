import { GraphQLObjectType } from 'graphql';
import { Query as UserQuery, Mutation as UserMutation } from './user';
import { Query as RoleQuery, Mutation as RoleMutation } from './role';
import MediaResolver from './media';
import PostResolver from './post';
import CategoryResolver from './category';

export const Query = new GraphQLObjectType({
  name: 'SGW_Queries',
  fields: {
    ...UserQuery,
    ...RoleQuery,
    ...MediaResolver,
    ...PostResolver,
    ...CategoryResolver
  }
});

export const Mutation = new GraphQLObjectType({
  name: 'SGW_Mutations',
  fields: {
    ...UserMutation,
    ...RoleMutation
  }
});