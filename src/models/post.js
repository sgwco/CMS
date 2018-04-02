import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { Media } from './media';
import { User } from './user';
import { Category } from './category';
import userData from '../data/user';
import categoryData from '../data/category';

export const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    excerpt: { type: GraphQLString },
    author: {
      type: GraphQLNonNull(User),
      resolve: ({ author }) => {
        return userData.find(item => item.id === author);
      }
    },
    slug: { type: GraphQLNonNull(GraphQLString) },
    category: {
      type: GraphQLList(Category),
      resolve: ({ category }) => {
        return categoryData.filter(item => item.id === category);
      }
    },
    thumbnail: { type: Media },
    count: { type: GraphQLNonNull(GraphQLInt) },
    publishDate: { type: GraphQLNonNull(GraphQLString) }
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