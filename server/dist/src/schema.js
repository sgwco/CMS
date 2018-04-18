'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _resolvers = require('./resolvers');

var Schema = new _graphql.GraphQLSchema({
  query: _resolvers.Query,
  mutation: _resolvers.Mutation
});

exports.default = Schema;