import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { Media } from '../models/media';
import mediaData from '../data/media';

export default {
  medias: {
    type: new GraphQLList(Media),
    resolve: () => {
      return mediaData;
    }
  },
  media: {
    type: Media,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (source, { id }) => {
      return mediaData.find(item => item.id === id);
    }
  }
}