import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { Media } from './media';
import { User } from './user';
import { Category } from './category';

export const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    excerpt: { type: GraphQLString },
    author: {
      type: User,
      resolve: async ({ author }, _, context) => {
        return context.dataloaders.usersByIds.load(author);
      }
    },
    slug: { type: GraphQLString },
    category: {
      type: Category,
      resolve: async ({ category }, _, context) => {
        return context.dataloaders.categoriesByIds.load(category);
      }
    },
    thumbnail: { type: GraphQLString },
    count: { type: GraphQLInt },
    publishDate: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ publish_date }) => {
        return publish_date;
      }
    }
  })
});

export const Product = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    slug: { type: GraphQLNonNull(GraphQLString) },
    shortDescription: { type: GraphQLString },
    longDescription: { type: GraphQLString },
    thumbnail: { type: Media },
    gallery: { type: GraphQLList(Media) },
    category: { type: GraphQLList(Category) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    salePrice: { type: GraphQLFloat },
    saleDuration: { type: GraphQLString },
    wholesalePrice: { type: GraphQLFloat },
    sku: { type: GraphQLString },
    stockQuantity: { type: GraphQLInt },
    tags: { type: GraphQLList(GraphQLString) }
  })
});