import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt } from 'graphql';
import { User } from './user';

export const Role = new GraphQLObjectType({
  name: 'Role',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    accessPermission: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ access_permission }) => access_permission
    }
  }
});