'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Role = undefined;

var _graphql = require('graphql');

var _user = require('./user');

var Role = exports.Role = new _graphql.GraphQLObjectType({
  name: 'Role',
  fields: {
    id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
    name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
    accessPermission: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLInt),
      resolve: function resolve(_ref) {
        var access_permission = _ref.access_permission;
        return access_permission;
      }
    }
  }
});