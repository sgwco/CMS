import { GraphQLObjectType } from 'graphql';
import UserResolver from './user';

export const Query = new GraphQLObjectType({
  name: 'SGW_Schemas',
  fields: () => ({
    ...UserResolver
  })
});