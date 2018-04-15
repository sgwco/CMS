import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError, GraphQLFloat } from 'graphql';
import uuid from 'uuid';
import moment from 'moment';
import { Package } from '../models';
import { promiseQuery, PREFIX } from '../config/database';
import { convertCamelCaseToSnakeCase } from '../utils/utils';

export const Query = {
  packages: {
    type: new GraphQLList(Package),
    resolve: async () => {
      return await promiseQuery(`SELECT * FROM ${PREFIX}package`);
    }
  },
  package: {
    type: Package,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, { id }) => {
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}package WHERE id='${id}'`);
      if (rows.length > 0) {
        return rows[0];
      }
      else throw new GraphQLError('Package does not exist');
    }
  }
}

export const Mutation = {
  createPackage: {
    type: Package,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      price: { type: GraphQLNonNull(GraphQLFloat) },
      interestRate: { type: GraphQLNonNull(GraphQLFloat) }
    },
    resolve: async (source, args) => {
      if (!args.name) {
        throw new GraphQLError('Name cannot be null');
      }

      if (!args.price || args.price < 0) {
        throw new GraphQLError('Price invalid');
      }

      if (!args.interestRate || args.interestRate < 0) {
        throw new GraphQLError('Interest rate invalid');
      }
      
      const id = uuid.v1();
      await promiseQuery(`INSERT INTO ${PREFIX}package VALUES (
        '${id}',
        '${args.name}',
        ${args.price},
        ${args.interestRate}
      )`);
      
      return {
        id,
        name: args.name,
        price: args.price,
        interest_rate: args.interestRate
      };
    }
  },
  editPackage: {
    type: Package,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      price: { type: GraphQLFloat },
      interestRate: { type: GraphQLFloat }
    },
    resolve: async (source, args, context) => {
      if (!args.id) {
        throw new GraphQLError('Edit package must have id');
      }

      if (args.name && args.name.length === 0) {
        throw new GraphQLError('Name cannot be null');
      }

      if (args.price && args.price < 0) {
        throw new GraphQLError('Price invalid');
      }

      if (args.interestRate && args.interestRate < 0) {
        throw new GraphQLError('Interest rate invalid');
      }
      
      const listArgs = Object.keys(args).filter(item => item !== 'id');
      const setStatement = listArgs.map(item => `${convertCamelCaseToSnakeCase(item)}='${args[item]}'`).join(',');

      await promiseQuery(`UPDATE ${PREFIX}package SET ${setStatement} WHERE id='${args.id}'`);
      context.dataloaders.packagesByIds.clear(args.id);

      return context.dataloaders.packagesByIds.load(args.id);
    }
  },
  removePackage: {
    type: GraphQLID,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, args) => {
      if (!args.id) {
        throw new GraphQLError('Id cannot be null');
      }

      promiseQuery(`DELETE FROM ${PREFIX}package WHERE id='${args.id}'`);
      return args.id;
    }
  }
}