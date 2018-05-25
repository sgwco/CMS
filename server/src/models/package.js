import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLEnumType, GraphQLFloat, GraphQLBoolean } from 'graphql';
import _ from 'lodash';

import { User } from './user';
import { promiseQuery, PREFIX } from '../config/database';
import { PACKAGE_DURATION, CURRENCY, PACKAGE_STATUS } from '../enum';

export const PackageDuration = new GraphQLEnumType({
  name: 'PackageDuration',
  values: _.transform(PACKAGE_DURATION, (result, value, key) => result[key] = { value })
});

export const PackageCurrency = new GraphQLEnumType({
  name: 'PackageCurrency',
  values: _.transform(CURRENCY, (result, value, key) => result[key] = { value })
})

export const PackageStatus = new GraphQLEnumType({
  name: 'PackageStatus',
  values: _.transform(PACKAGE_STATUS, (result, value, key) => result[key] = { value })
});

export const Package = new GraphQLObjectType({
  name: 'Package',
  fields: () => ({
    packageId: {
      type: GraphQLNonNull(GraphQLString),
      resolve({ package_id }) { return package_id; }
    },
    user: {
      type: GraphQLNonNull(User),
      resolve({ user_id }, _, context) {
        return context.dataloaders.usersByIds.load(user_id);
      }
    },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    currency: { type: GraphQLNonNull(PackageCurrency) },
    duration: { type: GraphQLNonNull(PackageDuration) },
    introducer: {
      type: User,
      resolve({ introducer }, _, context) {
        if (!introducer) return null;
        return context.dataloaders.usersByIds.load(introducer);
      }
    },
    registerDate: {
      type: GraphQLNonNull(GraphQLString),
      resolve({ register_date }) {
        return register_date;
      }
    },
    status: { type: GraphQLNonNull(PackageStatus) },
    transferMoney: {
      type: GraphQLNonNull(GraphQLList(PackageTransferMoneyProgress)),
      async resolve({ package_id }, _, context) {
        return promiseQuery(`SELECT * FROM ${PREFIX}package_progress WHERE package_id='${package_id}'`);;
      }
    }
  })
});

export const PackageTransferMoneyProgress = new GraphQLObjectType({
  name: 'PackageTransferMoneyProgress',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    amount: { type: GraphQLNonNull(GraphQLFloat) },
    interestRate: {
      type: GraphQLNonNull(GraphQLInt),
      resolve({ interest_rate }) {
        return interest_rate;
      }
    },
    date: { type: GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLNonNull(GraphQLBoolean) },
    withdrawDate: {
      type: GraphQLString,
      resolve({ withdraw_date }) {
        return withdraw_date;
      }
    }
  })
})