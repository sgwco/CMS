import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import fs from 'fs';
import { Media } from '../models';

export const Query = {
  medias: {
    type: new GraphQLList(Media),
    async resolve() {
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}media`);
      return rows;
    }
  },
  role: {
    type: Media,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) }
    },
    async resolve(source, { id }) {
      const rows = await promiseQuery(`SELECT * FROM ${PREFIX}media WHERE id='${id}'`);
      if (rows.length > 0) {
        return rows[0];
      }
      else throw new GraphQLError('Media does not exist');
    }
  }
}

export const Mutation = {
  uploadMedia: {
    type: Media,
    args: {
      file: { type: GraphQLNonNull(GraphQLString) },
      uploadBy: { type: GraphQLNonNull(GraphQLID) }
    },
    async resolve(source, args) {
      if (!args.file) {
        throw new GraphQLError('File cannot be null');
      }

      if (!args.uploadBy) {
        throw new GraphQLError('Upload user cannot be null');
      }
      
      await promiseQuery(`INSERT INTO ${PREFIX}role VALUES (
        NULL,
        '${args.name}',
        '${args.accessPermission}'
      )`);

      const lastId = await promiseQuery(`SELECT LAST_INSERT_ID()`);
      if (lastId.length > 0) {
        return {
          id: lastId[0]['LAST_INSERT_ID()'],
          name: args.name,
          access_permission: args.accessPermission
        };
      }
      else throw new GraphQLError('error.cannot_insert');
    }
  },
  removeMedia: {
    type: GraphQLID,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (source, args) => {
      if (!args.id) {
        throw new GraphQLError('Id cannot be null');
      }

      promiseQuery(`DELETE FROM ${PREFIX}role WHERE id='${args.id}'`);
      return args.id;
    }
  }
}