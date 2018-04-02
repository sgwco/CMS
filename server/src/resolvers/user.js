import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt } from 'graphql';
import uuid from 'uuid';
import moment from 'moment';
import { User, UserStatus } from '../models';
import { promiseQuery, PREFIX } from '../config/database';

export const Query = {
  users: {
    type: new GraphQLList(User),
    resolve: async () => {
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}user`);
      return rows;
    }
  },
  user: {
    type: User,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, { id }) => {
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}user WHERE id='${id}'`);
      return rows;
    }
  }
}

export const Mutation = {
  createUser: {
    type: User,
    args: {
      username: { type: GraphQLNonNull(GraphQLString) },
      password: { type: GraphQLNonNull(GraphQLString) },
      fullname: { type: GraphQLNonNull(GraphQLString) },
      email: { type: GraphQLNonNull(GraphQLString) },
      registrationDate: { type: GraphQLString, defaultValue: moment().format('YYYY-MM-DD HH:MM') },
      accessPermission: { type: GraphQLNonNull(GraphQLInt) },
      address: { type: GraphQLString, defaultValue: '' },
      phone: { type: GraphQLString, defaultValue: '' },
      userStatus: { type: UserStatus, defaultValue: 'ACTIVE' }
    },
    resolve: async (source, args) => {
      const id = uuid.v1();
      await promiseQuery(`INSERT INTO ${PREFIX}user VALUES (
        '${id}',
        '${args.username}',
        '${args.password}',
        '${args.fullname}',
        '${args.email}',
        '${args.registrationDate}',
        ${args.accessPermission},
        '${args.address}',
        '${args.phone}',
        '${args.userStatus}'
      )`);

      const result = Object.assign({}, args);
      result.id = id;
      return result;
    }
  }
}