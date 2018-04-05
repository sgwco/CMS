import { GraphQLEnumType, GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { User } from './user';

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
    uploadDate: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (media) => {
        return media.upload_date;
      }
    },
    uploadBy: {
      type: GraphQLNonNull(User),
      resolve: (media) => {
        return userData.find(item => item.id === media.upload_by);
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