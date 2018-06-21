import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError, GraphQLBoolean } from 'graphql';
import moment from 'moment';
import { Package, PackageCurrency, PackageDuration, PackageStatus, PackageTransferMoneyProgress } from '../models';
import { promiseQuery, PREFIX } from '../config/database';
import { convertCamelCaseToSnakeCase } from '../utils/utils';
import { CURRENCY } from '../enum';

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
      packageId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(source, { packageId }, { payload }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }
      
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}package WHERE package_id='${packageId}'`);
      
      if (rows.length > 0) {
        return rows[0];
      }
      else throw new GraphQLError('Package does not exist');
    }
  },
  activePackage: {
    type: GraphQLList(Package),
    async resolve(source, _, { payload }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      const activePackage = await promiseQuery(`SELECT * FROM ${PREFIX}package WHERE user_id='${payload.id}'`);
      if (activePackage.length > 0) {
        return activePackage;
      }
      else throw new GraphQLError('Package does not exist');
    }
  }
}

export const Mutation = {
  createPackage: {
    type: Package,
    args: {
      packageId: { type: GraphQLNonNull(GraphQLString) },
      userId: { type: GraphQLNonNull(GraphQLID) },
      introducer: { type: GraphQLID },
      price: { type: GraphQLNonNull(GraphQLInt) },
      duration: { type: GraphQLNonNull(PackageDuration) },
      registerDate: { type: GraphQLString }
    },
    async resolve(source, args, { payload, dataloaders }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!args.packageId) {
        throw new GraphQLError('Package cannot be null');
      }

      if (!args.userId) {
        throw new GraphQLError('User cannot be null');
      }

      if (!args.price || args.price < 0) {
        throw new GraphQLError('Price invalid');
      }

      if (!args.duration) {
        throw new GraphQLError('Duration cannot be null');
      }
      
      const now = moment();
      const registerDate = args.registerDate ? moment(args.registerDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : now.format('YYYY-MM-DD');
      const status = PackageStatus.getValue('PENDING').value;

      try {
        await promiseQuery(`INSERT INTO ${PREFIX}package VALUES (
          '${args.packageId}',
          '${args.userId}',
          '${args.price}',
          '${CURRENCY.VND}',
          '${args.duration}',
          ${args.introducer || null},
          '${registerDate}',
          '${status}'
        )`);
      }
      catch (error) {
        switch (error.code) {
          case 'ER_DUP_ENTRY':
            throw new GraphQLError('error.package_exist');
        }
      }

      const transferMoneyProgresses = {
        '6': { interestRate: 6 * 3, step: 2 },
        '12': { interestRate: 8 * 3, step: 4 }
      }

      const duration = transferMoneyProgresses[args.duration];
      let paymentDate = moment(registerDate, 'YYYY-MM-DD');

      for (let index = 0; index < duration.step; index += 1) {
        paymentDate = paymentDate.add(3, 'months');
        await promiseQuery(`INSERT INTO ${PREFIX}package_progress VALUES (
          NULL,
          '${args.packageId}',
          '${args.price * duration.interestRate / 100}',
          '${duration.interestRate}',
          '${paymentDate.format('YYYY-MM-DD')}',
          0,
          NULL
        )`);
      }
      
      return {
        status,
        package_id: args.packageId,
        user_id: args.userId,
        introducer: args.introducer,
        name: args.name,
        price: args.price,
        currency: CURRENCY.VND,
        duration: args.duration,
        register_date: args.registerDate || now.format('DD/MM/YYYY'),
        transferMoney: args.packageId
      };
    }
  },
  editPackage: {
    type: Package,
    args: {
      packageId: { type: GraphQLNonNull(GraphQLString) },
      userId: { type: GraphQLID },
      introducer: { type: GraphQLID },
      price: { type: GraphQLInt },
      duration: { type: PackageDuration },
      registerDate: { type: GraphQLString },
      status: { type: PackageStatus }
    },
    async resolve(_, args, { payload, dataloaders }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!args.packageId) {
        throw new GraphQLError('Edit package must have id');
      }

      if (args.price && args.price < 0) {
        throw new GraphQLError('error.price_invalid');
      }

      if (args.duration && args.duration === PackageDuration.getValue('MONTH_12').value) {
        const currentPackage = await dataloaders.packagesByIds.load(args.packageId);
        let withdrawDate = moment(currentPackage.register_date).add(6, 'months');
        const packageProgressPromises = [];

        for (let index = 0; index < 2; index += 1) {
          withdrawDate = withdrawDate.add(3, 'months');
          packageProgressPromises.push(
            promiseQuery(`INSERT INTO ${PREFIX}package_progress VALUES(
              NULL,
              '${args.packageId}',
              '${currentPackage.price * 0.08}',
              '${8 * 3}',
              '${withdrawDate.format('YYYY-MM-DD')}',
              '0',
              NULL
            )`)
          );
        }

        await Promise.all(packageProgressPromises);
      }
      
      const listArgs = Object.keys(args);
      if (args.registerDate) args.registerDate = moment(args.registerDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const setStatement = listArgs.map(item => `${convertCamelCaseToSnakeCase(item)}='${args[item]}'`).join(',');

      await promiseQuery(`UPDATE ${PREFIX}package SET ${setStatement} WHERE package_id='${args.packageId}'`);
      dataloaders.packagesByIds.clear(args.packageId);

      return {
        ...(await dataloaders.packagesByIds.load(args.packageId)),
        transferMoney: args.packageId
      }
    }
  },
  removePackage: {
    type: GraphQLID,
    args: {
      packageId: { type: GraphQLNonNull(GraphQLID) }
    },
    async resolve(source, args, { payload }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!args.packageId) {
        throw new GraphQLError('Id cannot be null');
      }

      promiseQuery(`DELETE FROM ${PREFIX}package WHERE package_id='${args.packageId}'`);
      return args.packageId;
    }
  },
  editPackageProgress: {
    type: Package,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      amount: { type: GraphQLInt },
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