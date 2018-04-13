import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLError, GraphQLInt } from 'graphql';
import { Post } from '../models';
import uuid from 'uuid';
import moment from 'moment';
import { promiseQuery, PREFIX } from '../config/database';

export const Query = {
  posts: {
    type: new GraphQLList(Post),
    resolve: () => {
      return promiseQuery(`SELECT * FROM ${PREFIX}post`);
    }
  },
  post: {
    type: Post,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (source, { id }) => {
      return postData.find(item => item.id === id);
    }
  }
}

export const Mutation = {
  createPost: {
    type: Post,
    args: {
      title: { type: GraphQLNonNull(GraphQLString) },
      content: { type: GraphQLNonNull(GraphQLString) },
      excerpt: { type: GraphQLString, defaultValue: '' },
      author: { type: GraphQLNonNull(GraphQLID) },
      slug: { type: GraphQLString, defaultValue: '' },
      category: { type: GraphQLString, defaultValue: '' },
      thumbnail: { type: GraphQLString, defaultValue: '' },
      count: { type: GraphQLInt },
    },
    async resolve(source, args, context) {
      const { title, content, excerpt, author, slug, category, thumbnail, count } = args;

      if (!title) {
        throw new GraphQLError('Title cannot be null');
      }

      if (!content) {
        throw new GraphQLError('Content cannot be null');
      }

      if (!author) {
        throw new GraphQLError('Author cannot be null');
      }

      const publishDate = moment().format('YYYY-MM-DD HH:MM');

      const id = uuid.v1();
      try {
        await promiseQuery(`INSERT INTO ${PREFIX}post VALUES (
          '${id}',
          '${title}',
          '${content}',
          '${excerpt}',
          '${author}',
          '${slug}',
          '${category}',
          '${thumbnail}',
          '${count}',
          '${publishDate}'
        )`);
      }
      catch (e) {
        console.log(e);
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            throw new GraphQLError('Post existed');
          case 'ER_NO_REFERENCED_ROW_2':
            throw new GraphQLError('Post data invalid');
        }
      }

      return {
        id,
        title,
        content,
        excerpt,
        author,
        slug,
        category,
        thumbnail,
        count,
        publish_date: publishDate
      };
    }
  },
  editPost: {
    type: Post,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      title: { type: GraphQLNonNull(GraphQLString) },
      content: { type: GraphQLNonNull(GraphQLString) },
      excerpt: { type: GraphQLString },
      author: { type: GraphQLID },
      slug: { type: GraphQLString },
      category: { type: GraphQLString },
      thumbnail: { type: GraphQLString },
      count: { type: GraphQLInt },
    },
    async resolve(source, args, context) {
      if (!args.id) {
        throw new GraphQLError('Id cannot be null');
      }

      if (!args.title) {
        throw new GraphQLError('Title cannot be null');
      }

      if (!args.content) {
        throw new GraphQLError('Content cannot be null');
      }

      if (!args.author) {
        throw new GraphQLError('Author cannot be null');
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
        await promiseQuery(`UPDATE ${PREFIX}post SET ${criteria} WHERE id='${args.id}'`);
      }
      catch (e) {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            throw new GraphQLError('Post existed');
          case 'ER_NO_REFERENCED_ROW_2':
            throw new GraphQLError('Post data invalid');
        }
      }
      context.dataloaders.postsByIds.clear(args.id);
      return context.dataloaders.postsByIds.load(args.id);
    }
  },
  removePost: {
    type: GraphQLID,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve(source, args, context) {
      const { id } = args;

      if (!id) {
        throw new GraphQLError('Id cannot be null');
      }

      promiseQuery(`DELETE FROM ${PREFIX}post WHERE id='${args.id}'`);
      return args.id;
    }
  }
}