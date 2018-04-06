import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError, GraphQLBoolean } from 'graphql';
import uuid from 'uuid';
import moment from 'moment';
import isEmail from 'validator/lib/isEmail';
import { User, UserStatus, Role } from '../models';
import { promiseQuery, PREFIX } from '../config/database';

export const Query = {
  users: {
    type: new GraphQLList(User),
    resolve: () => {
      return promiseQuery(`SELECT * FROM ${PREFIX}user`);;
    }
  },
  user: {
    type: User,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, { id }) => {
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}user WHERE id='${id}'`);
      if (rows.length > 0) {
        return rows[0];
      }
      throw new GraphQLError('User does not exist');
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
      fullname: { type: GraphQLString, defaultValue: '' },
      address: { type: GraphQLString, defaultValue: '' },
      phone: { type: GraphQLString, defaultValue: '' }
    },
    async resolve(source, args, context) {
      const { username, password, email, role, address, phone, fullname } = args;
      let roleData = null;

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
      
      try {
        roleData = await context.dataloaders.rolesByIds.load(role);
      }
      catch (e) {
        throw new GraphQLError('Role invalid');
      }

      const registrationDate = moment().format('YYYY-MM-DD HH:MM');

      const id = uuid.v1();
      try {
        await promiseQuery(`INSERT INTO ${PREFIX}user VALUES (
          '${id}',
          '${username}',
          '${password}',
          '${fullname}',
          '${email}',
          '${registrationDate}',
          '${role}',
          '${address}',
          '${phone}',
          '${UserStatus.getValue('ACTIVE').value}'
        )`);
      }
      catch (e) {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            throw new GraphQLError('User existed');
        }
      }

      return {
        id,
        username,
        password,
        fullname,
        email,
        role: roleData,
        address,
        phone,
        registration_date: registrationDate,
        user_status: UserStatus.getValue('ACTIVE')
      };
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
  }
}