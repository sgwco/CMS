import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError, GraphQLBoolean } from 'graphql';
import moment from 'moment';
import isEmail from 'validator/lib/isEmail';
import sha1 from 'sha1';

import { User, UserStatus, Role, UserMeta } from '../models';
import { promiseQuery, PREFIX } from '../config/database';
import { createToken } from '../config/auth';
import { convertCamelCaseToSnakeCase } from '../utils/utils';

export const Query = {
  users: {
    type: new GraphQLList(User),
    resolve: (source, args, { payload }) => {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      return promiseQuery(`SELECT * FROM ${PREFIX}user`);
    }
  },
  user: {
    type: User,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, { id }, { payload }) => {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }

      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}user WHERE id='${id}'`);
      if (rows.length > 0) {
        return rows[0];
      }
      throw new GraphQLError('error.user_not_exist');
    }
  },
  loggedInUser: {
    type: User,
    async resolve(source, _, { payload, dataloaders }) {
      if (!payload) {
        throw new GraphQLError('Unauthorized');
      }
      
      return dataloaders.usersByIds.load(payload.id);
    }
  }
}

export const Mutation = {
  createUser: {
    type: User,
    args: {
      username: { type: GraphQLNonNull(GraphQLString) },
      password: { type: GraphQLNonNull(GraphQLString) },
      role: { type: GraphQLNonNull(GraphQLID) },
      email: { type: GraphQLString },
      fullname: { type: GraphQLString },
      address: { type: GraphQLString },
      phone: { type: GraphQLString },
      userMeta: { type: GraphQLString }
    },
    async resolve(source, args, context) {
      if (!context.payload) {
        throw new GraphQLError('Unauthorized');
      }

      const { username, password, email, role, address, phone, fullname } = args;

      if (!username) {
        throw new GraphQLError('error.username_null');
      }

      if (!password) {
        throw new GraphQLError('error.password_null');
      }

      if (email && !isEmail(email)) {
        throw new GraphQLError('error.email_invalid');
      }

      if (!role) {
        throw new GraphQLError('error.role_null');
      }

      const registrationDate = moment().format('YYYY-MM-DD HH:MM');
      let id = null;

      try {
        await promiseQuery(`INSERT INTO ${PREFIX}user VALUES (
          NULL,
          '${username}',
          '${password}',
          '${fullname || ''}',
          '${email || ''}',
          '${registrationDate}',
          '${role}',
          '${address || ''}',
          '${phone || ''}',
          '${UserStatus.getValue('ACTIVE').value}'
        )`);
      }
      catch (e) {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            throw new GraphQLError('error.user_exist');
          case 'ER_NO_REFERENCED_ROW_2':
            throw new GraphQLError('error.data_invalid');
        }
      }

      const lastId = await promiseQuery(`SELECT LAST_INSERT_ID()`);
      if (lastId.length > 0) {
        id = lastId[0]['LAST_INSERT_ID()'];
      }
      else throw new GraphQLError('error.cannot_insert');

      if (args.userMeta) {
        const userMeta = JSON.parse(args.userMeta);
        const userMetaPromises = [];
        for (const index in userMeta) {
          userMetaPromises.push(promiseQuery(`INSERT INTO ${PREFIX}user_meta VALUES (
            NULL,
            '${id}',
            '${userMeta[index].metaKey}',
            '${userMeta[index].metaValue}'
          )`));
        }
        await Promise.all(userMetaPromises);
      }

      return {
        id: lastId[0]['LAST_INSERT_ID()'],
        username,
        password,
        fullname,
        email,
        role,
        address,
        phone,
        registration_date: registrationDate,
        user_status: UserStatus.getValue('ACTIVE').value
      };
    }
  },
  editUser: {
    type: User,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      password: { type: GraphQLString },
      email: { type: GraphQLString },
      role: { type: GraphQLID },
      fullname: { type: GraphQLString },
      address: { type: GraphQLString },
      phone: { type: GraphQLString },
      userMeta: { type: GraphQLString }
    },
    async resolve(source, args, context) {
      if (!args.id) {
        throw new GraphQLError('error.id_null');
      }

      if (args.email && !isEmail(args.email)) {
        throw new GraphQLError('error.email_invalid');
      }

      const setStatement = Object.keys(args)
        .filter(item => item !== 'id' && item !== 'userMeta' && args[item])
        .map(item => `${convertCamelCaseToSnakeCase(item)}='${args[item]}'`)
        .join(',');

      try {
        await promiseQuery(`UPDATE ${PREFIX}user SET ${setStatement} WHERE id='${args.id}'`);
      }
      catch (e) {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            throw new GraphQLError('error.user_exist');
          case 'ER_NO_REFERENCED_ROW_2':
            throw new GraphQLError('error.data_invalid');
        }
      }

      if (args.userMeta) {
        const userMeta = JSON.parse(args.userMeta);
        const userMetaPromises = [];
        const existMeta = await promiseQuery(`SELECT * from ${PREFIX}user_meta WHERE user_id='${args.id}'`);

        for (const meta of userMeta) {
          if (existMeta.length === 0 || existMeta.findIndex(item => item.meta_key === meta.metaKey) === -1) {
            userMetaPromises.push(
              promiseQuery(`INSERT INTO ${PREFIX}user_meta VALUES(NULL, '${args.id}', '${meta.metaKey}', '${meta.metaValue}')`)
            );
          }
          else {
            userMetaPromises.push(
              promiseQuery(`UPDATE ${PREFIX}user_meta SET meta_value='${meta.metaValue}' WHERE user_id='${args.id}' AND meta_key='${meta.metaKey}'`)
            );
          }
        }
        await Promise.all(userMetaPromises);
      }

      context.dataloaders.usersByIds.clear(args.id);

      return context.dataloaders.usersByIds.load(args.id);
    }
  },
  removeUser: {
    type: GraphQLID,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve(source, args, context) {
      const { id } = args;

      if (!id) {
        throw new GraphQLError('error.id_null');
      }

      promiseQuery(`DELETE FROM ${PREFIX}user WHERE id='${args.id}'`);
      return args.id;
    }
  },
  login: {
    type: GraphQLString,
    args: {
      username: { type: GraphQLNonNull(GraphQLString) },
      password: { type: GraphQLNonNull(GraphQLString) }
    },
    async resolve(source, args, context) {
      if (!args.username) {
        throw new GraphQLError('error.username_null');
      }

      if (!args.password) {
        throw new GraphQLError('error.password_null');
      }

      args.password = sha1(args.password);

      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}user WHERE username='${args.username}' AND password='${args.password}'`);
      
      if (rows.length > 0) {
        const role = await context.dataloaders.rolesByIds.load(rows[0].role);
        rows[0].role = role.access_permission;
        return createToken(rows[0]);
      }
      return null;
    }
  }
}