import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

export const Setting = new GraphQLObjectType({
  name: 'Setting',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    settingKey: { type: GraphQLNonNull(GraphQLString) },
    settingValue: { type: GraphQLNonNull(GraphQLString) }
  }
});