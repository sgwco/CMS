import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { Category } from '../models';
import categoryData from '../data/category';

export default {
  categories: {
    type: new GraphQLList(Category),
    resolve: () => {
      return categoryData;
    }
  },
  media: {
    type: Category,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (source, { id }) => {
      return categoryData.find(item => item.id === id);
    }
  }
}