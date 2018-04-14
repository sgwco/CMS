import { GraphQLObjectType } from 'graphql';
import { Query as UserQuery, Mutation as UserMutation } from './user';
import { Query as RoleQuery, Mutation as RoleMutation } from './role';
import MediaResolver from './media';
import { Query as PostQuery, Mutation as PostMutation } from './post';
import { Query as CategoryQuery, Mutation as CategoryMutation } from './category';
import { Query as PackageQuery, Mutation as PackageMutation } from './package';

export const Query = new GraphQLObjectType({
  name: 'SGW_Queries',
  fields: {
    ...UserQuery,
    ...RoleQuery,
    ...MediaResolver,
    ...CategoryQuery,
    ...PostQuery,
    ...PackageQuery
  }
});

export const Mutation = new GraphQLObjectType({
  name: 'SGW_Mutations',
  fields: {
    ...UserMutation,
    ...RoleMutation,
    ...PostMutation,
    ...CategoryMutation,
    ...PackageMutation
  }
});