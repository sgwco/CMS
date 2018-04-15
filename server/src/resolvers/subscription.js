import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError } from 'graphql';
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
      user_id: { type: GraphQLNonNull(GraphQLString) },
      package_id: { type: GraphQLNonNull(GraphQLString) },
      duration: { type: GraphQLNonNull(GraphQLInt) },
      subscribeDate: { type: GraphQLString },
      status: { type: GraphQLInt }
    },
    resolve: async (source, args) => {
      if (!args.user_id) {
        throw new GraphQLError('User cannot be null');
      }

      if (!args.package_id) {
        throw new GraphQLError('Package cannot be null');
      }

      if (!args.duration) {
        throw new GraphQLError('Duration cannot be null');
      }

      let subscribeDate = args.subscribeDate || moment().format('YYYY-MM-DD HH:MM');
      let status = args.status || SubscriptionStatus.getValue('ACTIVE').value;

      const id = uuid.v1();
      try {
        await promiseQuery(`INSERT INTO ${PREFIX}subscription VALUES (
          '${id}',
          '${args.user_id}',
          '${args.package_id}',
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
        user_id: args.user_id,
        package_id: args.package_id,
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
      user_id: { type: GraphQLNonNull(GraphQLString) },
      package_id: { type: GraphQLNonNull(GraphQLString) },
      duration: { type: GraphQLNonNull(GraphQLInt) },
      subscribeDate: { type: GraphQLString },
      status: { type: GraphQLInt }
    },
    resolve: async (source, args, context) => {
      if (!args.id) {
        throw new GraphQLError('Edit subscription must have id');
      }
      if (!args.user_id) {
        throw new GraphQLError('User cannot be null');
      }

      if (!args.package_id) {
        throw new GraphQLError('Package cannot be null');
      }

      if (!args.duration) {
        throw new GraphQLError('Duration cannot be null');
      }
      
      const listArgs = Object.keys(args).filter(item => item !== 'id');
      const setStatement = listArgs.map(item => `${convertCamelCaseToSnakeCase(item)}='${args[item]}'`).join(',');
      
      try {
        await promiseQuery(`UPDATE ${PREFIX}subscription SET ${setStatement} WHERE id='${args.id}'`);
      }
      catch (e) {
        console.log(`UPDATE ${PREFIX}subscription SET ${setStatement} WHERE id='${args.id}'`);
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