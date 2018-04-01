import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLList,
  GraphQLInterfaceType
} from 'graphql';
import { users } from './data';

export const MediaType = new GraphQLEnumType({
  name: 'MediaType',
  values: {
    IMAGE: { value: 'image' },
    FILE: { value: 'file' }
  }
});

export const MediaMeta = new GraphQLObjectType({
  name: 'MediaMeta',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    value: { type: GraphQLNonNull(GraphQLString) }
  })
});

export const Media = new GraphQLObjectType({
  name: 'Media',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    url: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(MediaType) },
    uploadDate: { type: GraphQLNonNull(GraphQLString) },
    uploadBy: {
      type: GraphQLNonNull(User),
      resolve: ({ uploadBy }) => {
        return uploadBy;
      }
    },
    mediaMeta: {
      type: GraphQLList(MediaMeta),
      resolve: (media) => {
        return media;
      }
    }
  })
});

export const Category = new GraphQLInterfaceType({
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
    description: { type: GraphQLString }
  })
});

export const PostCategory = new GraphQLObjectType({
  name: 'PostCategory',
  interfaces: [Category],
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
  interfaces: [Category],
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
    description: { type: GraphQLString } 
  })
});

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
        return author;
      }
    },
    slug: { type: GraphQLNonNull(GraphQLString) },
    category: { type: GraphQLList(PostCategory) },
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
    category: { type: GraphQLList(ProductCategory) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    salePrice: { type: GraphQLFloat },
    saleDuration: { type: GraphQLString },
    wholesalePrice: { type: GraphQLFloat },
    sku: { type: GraphQLString },
    stockQuantity: { type: GraphQLInt },
    tags: { type: GraphQLList(GraphQLString) }
  })
});