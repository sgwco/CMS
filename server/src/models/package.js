import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLEnumType, GraphQLFloat, GraphQLBoolean } from 'graphql';
import { User } from './user';
import { promiseQuery, PREFIX } from '../config/database';

export const PackageDuration = new GraphQLEnumType({
  name: 'PackageDuration',
  values: {
    MONTH_6: { value: 6 },
    MONTH_12: { value: 12 },
    MONTH_6_TRANSFER_12: { value: 18 }
  }
});

export const PackageCurrency = new GraphQLEnumType({
  name: 'PackageCurrency',
  values: {
    VND: { value: 'VND' },
    USD: { value: 'USD' }
  }
})

export const PackageStatus = new GraphQLEnumType({
  name: 'PackageStatus',
  values: {
    ACTIVE: { value: 'active' },
    PENDING: { value: 'pending' },
    EXPIRED: { value: 'expired' }
  }
});

export const Package = new GraphQLObjectType({
  name: 'Package',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    user: {
      type: GraphQLNonNull(User),
      resolve({ user_id }, _, context) {
        return context.dataloaders.usersByIds.load(user_id);
      }
    },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    currency: { type: GraphQLNonNull(PackageCurrency) },
    duration: { type: GraphQLNonNull(PackageDuration) },
    registerDate: {
      type: GraphQLNonNull(GraphQLString),
      resolve({ register_date }) {
        return register_date;
      }
    },
    status: { type: GraphQLNonNull(PackageStatus) },
    transferMoney: {
      type: GraphQLNonNull(GraphQLList(PackageTransferMoneyProgress)),
      async resolve({ id }, _, context) {
        return promiseQuery(`SELECT * FROM ${PREFIX}package_progress WHERE package_id='${id}'`);;
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
    status: { type: GraphQLNonNull(GraphQLBoolean) }
  })
})