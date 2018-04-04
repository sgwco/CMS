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
      if (rows.length > 0) {
        return rows[0];
      }
      else throw new GraphQLError('Role does not exist');
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
      
      return {
        id,
        name: args.name,
        access_permission: args.accessPermission
      };
    }
  },
  editRole: {
    type: Role,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      accessPermission: { type: GraphQLInt }
    },
    resolve: async (source, args, context) => {
      if (!args.id) {
        throw new GraphQLError('Edit role must have id');
      }
      
      const listArgs = Object.keys(args).filter(item => item !== 'id');
      const setStatement = listArgs.map(item => {
        switch (item) {
          case 'name':
            return `${item}='${args[item]}'`;
          case 'accessPermission':
            return `access_permission=${args[item]}`;
        }
      }).join(',');

      await promiseQuery(`UPDATE ${PREFIX}role SET ${setStatement} WHERE id='${args.id}'`);
      context.dataloaders.rolesByIds.clear(args.id);

      return context.dataloaders.rolesByIds.load(args.id);
    }
  },
  removeRole: {
    type: GraphQLString,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, args) => {
      if (!args.id) {
        throw new GraphQLError('Id cannot be null');
      }

      const result = await promiseQuery(`DELETE FROM ${PREFIX}role WHERE id='${args.id}'`);
      return args.id;
    }
  }
}