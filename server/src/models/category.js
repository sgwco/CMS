import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
// import { Media } from './media';

export const Category = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    slug: { type: GraphQLString },
    parent: { type: GraphQLString },
    description: { type: GraphQLString },
    thumbnail: { type: GraphQLString }
  })
});