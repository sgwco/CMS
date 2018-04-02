import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { Post } from '../models';
import postData from '../data/post';

export default {
  posts: {
    type: new GraphQLList(Post),
    resolve: () => {
      return postData;
    }
  },
  post: {
    type: Post,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (source, { id }) => {
      return postData.find(item => item.id === id);
    }
  }
}