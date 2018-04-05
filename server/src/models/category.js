import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { Media } from './media';

export const Category = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    slug: {
      type: GraphQLString,
      resolve: (category) => {
        return category.slug;
      }
    },
    parent: { type: Category },
    description: { type: GraphQLString },
    thumbnail: { type: Media }
  })
});