import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError, GraphQLFloat } from 'graphql';
import uuid from 'uuid';
import moment from 'moment';
import { Subscription, SubscriptionDuration, SubscriptionStatus } from '../models';
import { promiseQuery, PREFIX } from '../config/database';
import { convertCamelCaseToSnakeCase } from '../utils/utils';

export const Query = {
  subscriptions: {
    type: new GraphQLList(Subscription),
    resolve: async () => {
      return await promiseQuery(`SELECT * FROM ${PREFIX}subscription`);
    }
  },
  subscription: {
    type: Subscription,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, { id }) => {
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}subscription WHERE id='${id}'`);
      if (rows.length > 0) {
        return rows[0];
      }
      else throw new GraphQLError('Subscription does not exist');
    }
  }
}

export const Mutation = {
  createSubscription: {
    type: Subscription,
    args: {
      user: { type: GraphQLNonNull(GraphQLString) },
      package: { type: GraphQLNonNull(GraphQLString) },
      duration: { type: GraphQLNonNull(SubscriptionDuration) },
      subscribeDate: { type: GraphQLString },
      status: { type: SubscriptionStatus }
    },
    resolve: async (source, args) => {
      if (!args.user) {
        throw new GraphQLError('User cannot be null');
      }

      if (!args.package) {
        throw new GraphQLError('Package cannot be null');
      }

      if (!args.duration || args.duration < 0) {
        throw new GraphQLError('Duration invalid');
      }

      let subscribeDate = args.subscribeDate || moment().format('YYYY-MM-DD HH:MM');
      let status = args.status || SubscriptionStatus.getValue('ACTIVE').value;

      const id = uuid.v1();
      try {
        await promiseQuery(`INSERT INTO ${PREFIX}subscription VALUES (
          '${id}',
          '${args.user}',
          '${args.package}',
          ${args.duration},
          '${subscribeDate}',
          '${status}'
        )`);
      }
      catch (e) {
        throw new GraphQLError('Subscription data invalid');
      }
      
      return {
        id,
        user_id: args.user,
        package_id: args.package,
        duration: args.duration,
        subscribe_date: subscribeDate,
        status
      };
    }
  },
  editSubscription: {
    type: Subscription,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      userId: { type: GraphQLString },
      packageId: { type: GraphQLString },
      duration: { type: SubscriptionDuration },
      subscribeDate: { type: GraphQLString },
      status: { type: SubscriptionStatus }
    },
    resolve: async (source, args, context) => {
      if (!args.id) {
        throw new GraphQLError('Edit subscription must have id');
      }
      
      const listArgs = Object.keys(args).filter(item => item !== 'id');
      const setStatement = listArgs.map(item => `${convertCamelCaseToSnakeCase(item)}='${args[item]}'`).join(',');

      try {
        await promiseQuery(`UPDATE ${PREFIX}subscription SET ${setStatement} WHERE id='${args.id}'`);
      }
      catch (e) {
        switch (e.code) {
          case 'ER_NO_REFERENCED_ROW_2':
            throw new GraphQLError('Subscription data invalid');
        }
      }
      
      context.dataloaders.subscriptionsByIds.clear(args.id);
      return context.dataloaders.subscriptionsByIds.load(args.id);
    }
  },
  removeSubscription: {
    type: GraphQLID,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, args) => {
      if (!args.id) {
        throw new GraphQLError('Id cannot be null');
      }

      promiseQuery(`DELETE FROM ${PREFIX}subscription WHERE id='${args.id}'`);
      return args.id;
    }
  }
}