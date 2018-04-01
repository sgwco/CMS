import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { PostCategory } from '../models/category';
import categoryData from '../data/category';

export default {
  categories: {
    type: new GraphQLList(PostCategory),
    resolve: () => {
      return categoryData;
    }
  },
  media: {
    type: PostCategory,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (source, { id }) => {
      return categoryData.find(item => item.id === id);
    }
  }
}