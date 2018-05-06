import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError, GraphQLFloat, GraphQLBoolean } from 'graphql';
import uuid from 'uuid';
import moment from 'moment';
import { Package, PackageCurrency, PackageDuration, PackageStatus, PackageTransferMoneyProgress } from '../models';
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
    async resolve(source, { id }, { payload }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }
      
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}package WHERE id='${id}'`);
      
      if (rows.length > 0) {
        return rows[0];
      }
      else throw new GraphQLError('Package does not exist');
    }
  },
  activePackage: {
    type: Package,
    async resolve(source, _, { payload }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      const activePackage = await promiseQuery(`SELECT * FROM ${PREFIX}package WHERE user_id='${payload.id}' AND status='active'`);

      if (activePackage.length > 0) {
        return activePackage[0];
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

      const existPackages = await promiseQuery(`SELECT id FROM ${PREFIX}package WHERE user_id='${args.userId}' AND status='active'`);
      if (existPackages.length > 0) {
        throw new GraphQLError(`Cannot create new package for this user due to the existance of ${existPackages.length} active package(s)`);
      }
      
      const now = moment();
      const registerDate = args.registerDate ? moment(args.registerDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : now.format('YYYY-MM-DD');
      const status = PackageStatus.getValue('PENDING').value;
      
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

      const transferMoneyProgresses = {
        '6': { interestRate: 6, step: 2 },
        '12': { interestRate: 8, step: 4 }
      }

      const duration = transferMoneyProgresses[args.duration];
      let paymentDate = moment(registerDate, 'YYYY-MM-DD');

      for (let index = 0; index < duration.step; index += 1) {
        const progressId = uuid.v1();
        paymentDate = paymentDate.add(3, 'months');
        await promiseQuery(`INSERT INTO ${PREFIX}package_progress VALUES (
          '${progressId}',
          '${id}',
          '${args.price * duration.interestRate / 100}',
          '${duration.interestRate}',
          '${paymentDate.format('YYYY-MM-DD')}',
          0,
          NULL
        )`);
      }
      
      return {
        id,
        status,
        user_id: args.userId,
        name: args.name,
        price: args.price,
        currency: args.currency,
        duration: args.duration,
        register_date: args.registerDate || now.format('DD/MM/YYYY'),
        transferMoney: id
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
    async resolve(source, args, { payload, dataloaders }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!args.id) {
        throw new GraphQLError('Edit package must have id');
      }

      if (args.price && args.price < 0) {
        throw new GraphQLError('Price invalid');
      }

      if (args.duration && args.duration === PackageDuration.getValue('MONTH_12').value) {
        const currentPackage = await dataloaders.packagesByIds.load(args.id);
        let withdrawDate = moment(currentPackage.register_date).add(6, 'months');
        const packageProgressPromises = [];

        for (let index = 0; index < 2; index += 1) {
          const progressId = uuid.v1();
          withdrawDate = withdrawDate.add(3, 'months');
          packageProgressPromises.push(
            promiseQuery(`INSERT INTO ${PREFIX}package_progress VALUES(
              '${progressId}',
              '${args.id}',
              '${currentPackage.price * 0.08}',
              '8',
              '${withdrawDate.format('YYYY-MM-DD')}',
              '0',
              NULL
            )`)
          );
        }

        await Promise.all(packageProgressPromises);
      }
      
      const listArgs = Object.keys(args).filter(item => item !== 'id');
      if (args.registerDate) args.registerDate = moment(args.registerDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const setStatement = listArgs.map(item => `${convertCamelCaseToSnakeCase(item)}='${args[item]}'`).join(',');

      await promiseQuery(`UPDATE ${PREFIX}package SET ${setStatement} WHERE id='${args.id}'`);
      dataloaders.packagesByIds.clear(args.id);

      return {
        ...(await dataloaders.packagesByIds.load(args.id)),
        transferMoney: args.id
      }
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
  },
  editPackageProgress: {
    type: Package,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      amount: { type: GraphQLFloat },
      interestRate: { type: GraphQLInt },
      date: { type: GraphQLString },
      status: { type: GraphQLBoolean },
      withdrawDate: { type: GraphQLString }
    },
    async resolve(source, args, { payload, dataloaders }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!args.id) {
        throw new GraphQLError('Id cannot be null');
      }

      args.status = args.status ? 1 : 0;
      if (args.withdrawDate) args.withdrawDate = moment(args.withdrawDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const listArgs = Object.keys(args).filter(item => item !== 'id');
      const setStatement = listArgs.map(item => `${convertCamelCaseToSnakeCase(item)}='${args[item]}'`).join(',');

      await promiseQuery(`UPDATE ${PREFIX}package_progress SET ${setStatement} WHERE id='${args.id}'`);
      dataloaders.packageProgressesByIds.clear(args.id);
      const packageProgress = await dataloaders.packageProgressesByIds.load(args.id);

      return dataloaders.packagesByIds.load(packageProgress.package_id);
    }
  }
}