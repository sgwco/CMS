import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLEnumType, GraphQLFloat } from 'graphql';
import { User } from './user';

export const SubscriptionDuration = new GraphQLEnumType({
  name: 'SubscriptionDuration',
  values: {
    MONTH_3: { value: 3 },
    MONTH_6: { value: 6 },
    MONTH_9: { value: 9 },
    MONTH_12: { value: 12 }
  }
});

export const SubscriptionStatus = new GraphQLEnumType({
  name: 'SubscriptionStatus',
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
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    interestRate: {
      type: GraphQLNonNull(GraphQLFloat),
      resolve: ({ interest_rate }) => interest_rate
    }
  })
});

export const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    user_id: {
      type: GraphQLNonNull(User),
      resolve: async ({ user_id }, _, context) => {
        return context.dataloaders.usersByIds.load(user_id);
      }
    },
    package_id: {
      type: GraphQLNonNull(Package),
      resolve: async ({ package_id }, _, context) => {
        return context.dataloaders.packagesByIds.load(package_id);
      }
    },
    duration: { type: GraphQLNonNull(GraphQLInt) },
    subscribeDate: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ subscribe_date }) => subscribe_date
    },
    status: { type: GraphQLNonNull(SubscriptionStatus) }
  })
});