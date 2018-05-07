import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError, GraphQLBoolean } from 'graphql';
import uuid from 'uuid';
import moment from 'moment';
import isEmail from 'validator/lib/isEmail';
import sha1 from 'sha1';

import { User, UserStatus, Role, UserMeta } from '../models';
import { promiseQuery, PREFIX } from '../config/database';
import { createToken } from '../config/auth';

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
      throw new GraphQLError('User does not exist');
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
      email: { type: GraphQLNonNull(GraphQLString) },
      role: { type: GraphQLNonNull(GraphQLID) },
      fullname: { type: GraphQLString },
      address: { type: GraphQLString },
      phone: { type: GraphQLString },
      // userMeta: { type: GraphQLList(UserMeta) }
    },
    async resolve(source, args, context) {
      if (!context.payload) {
        throw new GraphQLError('Unauthorized');
      }

      const { username, password, email, role, address, phone, fullname } = args;

      if (!username) {
        throw new GraphQLError('Username cannot be null');
      }

      if (!password) {
        throw new GraphQLError('Password cannot be null');
      }

      if (!email) {
        throw new GraphQLError('Email cannot be null');
      }

      if (!isEmail(email)) {
        throw new GraphQLError('Email invalid');
      }

      if (!role) {
        throw new GraphQLError('Role cannot be null');
      }

      const registrationDate = moment().format('YYYY-MM-DD HH:MM');

      const id = uuid.v1();
      // try {
      //   await promiseQuery(`INSERT INTO ${PREFIX}user VALUES (
      //     '${id}',
      //     '${username}',
      //     '${password}',
      //     '${fullname}',
      //     '${email}',
      //     '${registrationDate}',
      //     '${role}',
      //     '${address}',
      //     '${phone}',
      //     '${UserStatus.getValue('ACTIVE').value}'
      //   )`);
      // }
      // catch (e) {
      //   switch (e.code) {
      //     case 'ER_DUP_ENTRY':
      //       throw new GraphQLError('User existed');
      //     case 'ER_NO_REFERENCED_ROW_2':
      //       throw new GraphQLError('User data invalid');
      //   }
      // }

      return {
        id,
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
      phone: { type: GraphQLString }
    },
    async resolve(source, args, context) {
      if (!args.id) {
        throw new GraphQLError('Id cannot be null');
      }

      if (args.email && !isEmail(args.email)) {
        throw new GraphQLError('Email invalid');
      }

      const criteria = Object.keys(args).map(item => {
        switch (typeof args[item]) {
          case 'number':
            return `${item}=${args[item]}`;
          default:
            return `${item}='${args[item]}'`;
        }
      }).join(', ');

      try {
        await promiseQuery(`UPDATE ${PREFIX}user SET ${criteria} WHERE id='${args.id}'`);
      }
      catch (e) {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            throw new GraphQLError('User existed');
          case 'ER_NO_REFERENCED_ROW_2':
            throw new GraphQLError('User data invalid');
        }
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
        throw new GraphQLError('Id cannot be null');
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
        throw new GraphQLError('Username cannot be null');
      }

      if (!args.password) {
        throw new GraphQLError('Password cannot be null');
      }

      args.password = sha1(args.password);

      const rows = await promiseQuery(`SELECT id, username, email, fullname, role FROM ${PREFIX}user WHERE username='${args.username}' AND password='${args.password}'`);
      if (rows.length > 0) {
        const role = await context.dataloaders.rolesByIds.load(rows[0].role);
        rows[0].role = role.access_permission;
        return createToken(rows[0]);
      }
      return null;
    }
  }
}