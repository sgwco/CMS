import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { User } from '../models/user';
import { users } from '../data';

export default {
  users: {
    type: new GraphQLList(User),
    resolve: () => {
      return users;
    }
  },
  user: {
    type: User,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (source, { id }) => {
      return users.find(item => item.id === id);
    }
  }
}