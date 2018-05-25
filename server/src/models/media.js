import { GraphQLEnumType, GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { User } from './user';

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
    url: { type: GraphQLNonNull(GraphQLString) },
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
    }
  })
});