import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { Category } from '../models';
import uuid from 'uuid';
import { promiseQuery, PREFIX } from '../config/database';

export const Query = {
  categories: {
    type: new GraphQLList(Category),
    resolve: () => {
      return promiseQuery(`SELECT * FROM ${PREFIX}category`);
    }
  },
  media: {
    type: Category,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (source, { id }) => {
      return categoryData.find(item => item.id === id);
    }
  }
}

export const Mutation = {
  createCategory: {
    type: Category,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      slug: { type: GraphQLString, defaultValue: '' },
      parent: { type: GraphQLString, defaultValue: '' },
      description: { type: GraphQLString, defaultValue: '' },
      thumbnail: { type: GraphQLString, defaultValue: '' },
    },
    async resolve(source, args, context) {
      const { name, slug, parent, description, thumbnail } = args;

      if (!name) {
        throw new GraphQLError('Name cannot be null');
      }

      const id = uuid.v1();
      try {
        await promiseQuery(`INSERT INTO ${PREFIX}category VALUES (
          '${id}',
          '${name}',
          '${slug}',
          '${parent}',
          '${description}',
          '${thumbnail}'
        )`);
      }
      catch (e) {
        console.log(e);
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            throw new GraphQLError('Category existed');
          case 'ER_NO_REFERENCED_ROW_2':
            throw new GraphQLError('Category data invalid');
        }
      }

      return {
        id,
        name,
        slug,
        parent,
        description,
        thumbnail
      };
    }
  },
  editCategory: {
    type: Category,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLNonNull(GraphQLString) },
      slug: { type: GraphQLString },
      parent: { type: GraphQLString },
      description: { type: GraphQLString },
      thumbnail: { type: GraphQLString }
    },
    async resolve(source, args, context) {
      if (!args.id) {
        throw new GraphQLError('Id cannot be null');
      }

      if (!args.name) {
        throw new GraphQLError('Name cannot be null');
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
        await promiseQuery(`UPDATE ${PREFIX}category SET ${criteria} WHERE id='${args.id}'`);
      }
      catch (e) {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            throw new GraphQLError('Category existed');
          case 'ER_NO_REFERENCED_ROW_2':
            throw new GraphQLError('Category data invalid');
        }
      }
      context.dataloaders.categoriesByIds.clear(args.id);
      return context.dataloaders.categoriesByIds.load(args.id);
    }
  },
  removeCategory: {
    type: GraphQLID,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve(source, args, context) {
      const { id } = args;

      if (!id) {
        throw new GraphQLError('Id cannot be null');
      }

      promiseQuery(`DELETE FROM ${PREFIX}category WHERE id='${args.id}'`);
      return args.id;
    }
  }
}