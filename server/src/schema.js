import { GraphQLSchema } from 'graphql';
import { Query, Mutation } from './resolvers';

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;