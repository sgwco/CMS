import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLEnumType, GraphQLFloat } from 'graphql';
import { User } from './user';

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
      async resolve({ user_id }, _, context) {
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
    status: { type: GraphQLNonNull(PackageStatus) }
  })
});