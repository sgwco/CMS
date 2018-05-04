import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError, GraphQLFloat } from 'graphql';
import uuid from 'uuid';
import moment from 'moment';
import { Package, PackageCurrency, PackageDuration, PackageStatus } from '../models';
import { promiseQuery, PREFIX } from '../config/database';
import { convertCamelCaseToSnakeCase } from '../utils/utils';

export const Query = {
  packages: {
    type: new GraphQLList(Package),
    async resolve(source, args, { payload }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      return await promiseQuery(`SELECT * FROM ${PREFIX}package`);
    }
  },
  package: {
    type: Package,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, { id }, { payload }) => {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }
      
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
      userId: { type: GraphQLNonNull(GraphQLString) },
      price: { type: GraphQLNonNull(GraphQLFloat) },
      currency: { type: GraphQLNonNull(PackageCurrency) },
      duration: { type: GraphQLNonNull(PackageDuration) },
      registerDate: { type: GraphQLString }
    },
    async resolve(source, args, { payload, dataloaders }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!args.userId) {
        throw new GraphQLError('User cannot be null');
      }

      if (!args.price || args.price < 0) {
        throw new GraphQLError('Price invalid');
      }

      if (!args.currency) {
        throw new GraphQLError('Currency cannot be null');
      }

      if (!args.duration) {
        throw new GraphQLError('Duration cannot be null');
      }

      const existPackages = await promiseQuery(`SELECT id FROM ${PREFIX}package WHERE user_id=${args.userId} and status=${PackageDuration.getValue('ACTIVE').value}`);
      if (existPackages.length > 0) {
        throw new GraphQLError(`Cannot create new package for this user due to the existance of ${existPackages.length} active package(s)`);
      }
      
      const now = moment();
      const registerDate = args.registerDate ? moment(args.registerDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : now.format('YYYY-MM-DD');
      const status = PackageStatus.getValue('ACTIVE').value;
      
      const id = uuid.v1();
      await promiseQuery(`INSERT INTO ${PREFIX}package VALUES (
        '${id}',
        '${args.userId}',
        '${args.price}',
        '${args.currency}',
        '${args.duration}',
        '${registerDate}',
        '${status}'
      )`);
      
      return {
        id,
        status,
        user_id: args.userId,
        name: args.name,
        price: args.price,
        currency: args.currency,
        duration: args.duration,
        register_date: args.registerDate || now.format('DD/MM/YYYY')
      };
    }
  },
  editPackage: {
    type: Package,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      userId: { type: GraphQLString },
      price: { type: GraphQLFloat },
      currency: { type: PackageCurrency },
      duration: { type: PackageDuration },
      registerDate: { type: GraphQLString },
      status: { type: PackageStatus }
    },
    async resolve(source, args, context) {
      if (!context.payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!args.id) {
        throw new GraphQLError('Edit package must have id');
      }

      if (args.price && args.price < 0) {
        throw new GraphQLError('Price invalid');
      }
      
      const listArgs = Object.keys(args).filter(item => item !== 'id');
      if (args.registerDate) args.registerDate = moment(args.registerDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

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
    async resolve(source, args, { payload }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!args.id) {
        throw new GraphQLError('Id cannot be null');
      }

      promiseQuery(`DELETE FROM ${PREFIX}package WHERE id='${args.id}'`);
      return args.id;
    }
  }
}