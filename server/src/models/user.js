import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLEnumType, GraphQLList } from 'graphql';
import { Role } from './role';
import { promiseQuery, PREFIX } from '../config/database';

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
    userId: {
      type: GraphQLNonNull(GraphQLString),
      resolve({ user_id }) {
        return user_id;
      }
    },
    metaKey: {
      type: GraphQLNonNull(GraphQLString),
      resolve({ meta_key }) {
        return meta_key;
      }
    },
    metaValue: {
      type: GraphQLString,
      resolve({ meta_value }) {
        return meta_value;
      }
    }
  }
});

export const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    fullname: { type: GraphQLString },
    email: { type: GraphQLString },
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
    userMeta: {
      type: GraphQLList(UserMeta),
      resolve({ id }) {
        return promiseQuery(`SELECT * FROM ${PREFIX}user_meta WHERE user_id='${id}'`);
      }
    }
  }
});