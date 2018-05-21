import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

export const Setting = new GraphQLObjectType({
  name: 'Setting',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    settingKey: {
      type: GraphQLNonNull(GraphQLString),
      resolve({ setting_key }) { return setting_key; }
    },
    settingValue: {
      type: GraphQLNonNull(GraphQLString),
      resolve({ setting_value }) { return setting_value; }
    }
  }
});