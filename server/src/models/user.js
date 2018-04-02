import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLEnumType } from 'graphql';

export const UserStatus = new GraphQLEnumType({
  name: 'UserStatus',
  values: {
    ACTIVE: { value: 'active' },
    BANNED: { value: 'banned' },
    PENDING: { value: 'pending' }
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
      resolve: ({ registration_date }) => {
        return registration_date;
      }
    },
    accessPermission: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ access_permission }) => {
        return access_permission;
      }
    },
    address: { type: GraphQLString },
    phone: { type: GraphQLString },
    userStatus: {
      type: UserStatus,
      resolve: ({ user_status }) => {
        return user_status;
      }
    }
  }
});