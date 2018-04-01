import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { User } from '../models/user';
import userData from '../data/user';

export default {
  users: {
    type: new GraphQLList(User),
    resolve: () => {
      return userData;
    }
  },
  user: {
    type: User,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (source, { id }) => {
      return userData.find(item => item.id === id);
    }
  }
}