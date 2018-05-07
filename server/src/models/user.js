import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLEnumType, GraphQLList } from 'graphql';
import { Role } from './role';

export const UserStatus = new GraphQLEnumType({
  name: 'UserStatus',
  values: {
    ACTIVE: { value: 'active' },
    BANNED: { value: 'banned' },
    PENDING: { value: 'pending' }
  }
});

export const UserMeta = new GraphQLObjectType({
  name: 'UserMeta',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    userId: { type: GraphQLNonNull(GraphQLString) },
    metaKey: { type: GraphQLNonNull(GraphQLString) },
    metaValue: { type: GraphQLString }
  }
});

export const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    fullname: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    registrationDate: {
      type: GraphQLNonNull(GraphQLString),
      resolve({ registration_date }) {
        return registration_date;
      }
    },
    role: {
      type: GraphQLNonNull(Role),
      async resolve({ role }, _, context) {
        return context.dataloaders.rolesByIds.load(role);
      }
    },
    address: { type: GraphQLString },
    phone: { type: GraphQLString },
    userStatus: {
      type: UserStatus,
      resolve({ user_status }) {
        return user_status;
      }
    },
    userMeta: { type: GraphQLList(UserMeta) }
  }
});