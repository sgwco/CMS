'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Setting = undefined;

var _graphql = require('graphql');

var Setting = exports.Setting = new _graphql.GraphQLObjectType({
  name: 'Setting',
  fields: {
    id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
    settingKey: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      resolve: function resolve(_ref) {
        var setting_key = _ref.setting_key;
        return setting_key;
      }
    },
    settingValue: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      resolve: function resolve(_ref2) {
        var setting_value = _ref2.setting_value;
        return setting_value;
      }
    }
  }
});