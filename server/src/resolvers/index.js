import { GraphQLObjectType } from 'graphql';
import UserResolver from './user';
import MediaResolver from './media';
import PostResolver from './post';
import CategoryResolver from './category';

export const Query = new GraphQLObjectType({
  name: 'SGW_Schemas',
  fields: () => ({
    ...UserResolver,
    ...MediaResolver,
    ...PostResolver,
    ...CategoryResolver
  })
});