import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError } from 'graphql';
import uuid from 'uuid';
import moment from 'moment';
import { Role } from '../models';
import { promiseQuery, PREFIX } from '../config/database';

export const Query = {
  roles: {
    type: new GraphQLList(Role),
    resolve: async () => {
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}role`);
      return rows;
    }
  },
  role: {
    type: Role,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, { id }) => {
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}role WHERE id='${id}'`);
      return rows;
    }
  }
}

export const Mutation = {
  createRole: {
    type: Role,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      accessPermission: { type: GraphQLNonNull(GraphQLInt) }
    },
    resolve: async (source, args) => {
      if (!args.name) {
        throw new GraphQLError('Name cannot be null');
      }

      if (args.accessPermission <= 0) {
        throw new GraphQLError('Role Capabilities invalid');
      }
      
      const id = uuid.v1();
      await promiseQuery(`INSERT INTO ${PREFIX}role VALUES (
        '${id}',
        '${args.name}',
        '${args.accessPermission}'
      )`);

      const result = Object.assign({}, args);
      result.id = id;
      return result;
    }
  }
}