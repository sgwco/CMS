'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Category = undefined;

var _graphql = require('graphql');

// import { Media } from './media';

var Category = exports.Category = new _graphql.GraphQLObjectType({
  name: 'Category',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      slug: { type: _graphql.GraphQLString },
      parent: { type: _graphql.GraphQLString },
      description: { type: _graphql.GraphQLString },
      thumbnail: { type: _graphql.GraphQLString }
    };
  }
});