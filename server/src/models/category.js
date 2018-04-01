import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { Media } from './media';

export const PostCategory = new GraphQLObjectType({
  name: 'PostCategory',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    slug: {
      type: GraphQLString,
      resolve: (category) => {
        return category.slug;
      }
    },
    parent: { type: PostCategory },
    description: { type: GraphQLString }
  })
});

export const ProductCategory = new GraphQLObjectType({
  name: 'ProductCategory',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    slug: {
      type: GraphQLString,
      resolve: (category) => {
        return category.slug;
      }
    },
    parent: { type: ProductCategory },
    description: { type: GraphQLString },
    thumbnail: { type: Media }
  })
});