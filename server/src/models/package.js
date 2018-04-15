import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLEnumType, GraphQLFloat } from 'graphql';

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
    userId: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ user_id }) => user_id
    },
    packageId: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ package_id }) => package_id
    },
    duration: { type: GraphQLNonNull(SubscriptionDuration) },
    subscribeDate: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ subscribe_date }) => subscribe_date
    },
    status: { type: GraphQLNonNull(SubscriptionStatus) }
  })
});