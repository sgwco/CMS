'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Category = undefined;

var _graphql = require('graphql');

var _media = require('./media');

var Category = exports.Category = new _graphql.GraphQLObjectType({
  name: 'Category',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      slug: {
        type: _graphql.GraphQLString,
        resolve: function resolve(category) {
          return category.slug;
        }
      },
      parent: { type: Category },
      description: { type: _graphql.GraphQLString },
      thumbnail: { type: _media.Media }
    };
  }
});