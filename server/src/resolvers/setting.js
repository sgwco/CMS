import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError } from 'graphql';
import moment from 'moment';
import _ from 'lodash';
import { Setting } from '../models';
import { promiseQuery, PREFIX } from '../config/database';
import { convertCamelCaseToSnakeCase } from '../utils/utils';

export const Query = {
  settings: {
    type: new GraphQLList(Setting),
    async resolve(source, args, { payload }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      return await promiseQuery(`SELECT * FROM ${PREFIX}setting`);
    }
  },
  setting: {
    type: Setting,
    args: {
      settingKeys: { type: new GraphQLList(GraphQLString) }
    },
    resolve: async (source, { settingKeys }, { payload }) => {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (_.isEmpty(settingKeys)) {
        return [];
      }

      const querySettingKeys = settingKeys.map(key => `'${key}'`).join(', ');
      return await promiseQuery(`SELECT * FROM ${PREFIX}setting WHERE setting_key IN (${querySettingKeys})`);
    }
  }
}

export const Mutation = {
  createSetting: {
    type: Setting,
    args: {
      settingKey: { type: GraphQLNonNull(GraphQLString) },
      settingValue: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: async (source, { settingKey, settingValue }, { payload }) => {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!settingKey) {
        throw new GraphQLError('Setting key cannot be null');
      }
      
      if (!settingValue) {
        throw new GraphQLError('Setting value cannot be null');
      }
      
      await promiseQuery(`INSERT INTO ${PREFIX}setting VALUES (
        NULL,
        '${settingKey}',
        '${settingValue}'
      )`);

      const lastId = await promiseQuery(`SELECT LAST_INSERT_ID()`);
      if (lastId.length > 0) {
        return {
          id: lastId[0]['LAST_INSERT_ID()'],
          setting_key: settingKey,
          setting_value: settingValue
        };
      }
      else throw new GraphQLError('Cannot insert new setting.');
    }
  },
  editRole: {
    type: Setting,
    args: {
      settingKey: { type: GraphQLNonNull(GraphQLString) },
      settingValue: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (source, { settingKey, settingValue }, { payload, dataloaders }) => {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!settingKey) {
        throw new GraphQLError('Setting key cannot be null');
      }
      
      if (!settingValue) {
        throw new GraphQLError('Setting value cannot be null');
      }

      await promiseQuery(`UPDATE ${PREFIX}setting SET setting_value='${settingValue}' WHERE setting_key='${settingKey}'`);
      dataloaders.settingsByKeys.clear(settingKey);

      return dataloaders.settingsByKeys.load(settingKey);
    }
  },
  removeRole: {
    type: GraphQLID,
    args: {
      settingKey: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: async (source, { settingKey }, { payload, dataloaders }) => {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      if (!settingKey) {
        throw new GraphQLError('Setting key cannot be null');
      }

      await promiseQuery(`UPDATE ${PREFIX}setting SET setting_value='' WHERE setting_key='${settingKey}'`);
      dataloaders.settingsByKeys.clear(settingKey);

      return dataloaders.settingsByKeys.load(settingKey);
    }
  }
}