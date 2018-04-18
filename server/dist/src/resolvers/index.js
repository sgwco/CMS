'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mutation = exports.Query = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _graphql = require('graphql');

var _user = require('./user');

var _role = require('./role');

var _media = require('./media');

var _media2 = _interopRequireDefault(_media);

var _post = require('./post');

var _post2 = _interopRequireDefault(_post);

var _category = require('./category');

var _category2 = _interopRequireDefault(_category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Query = exports.Query = new _graphql.GraphQLObjectType({
  name: 'SGW_Queries',
  fields: _extends({}, _user.Query, _role.Query, _media2.default, _post2.default, _category2.default)
});

var Mutation = exports.Mutation = new _graphql.GraphQLObjectType({
  name: 'SGW_Mutations',
  fields: _extends({}, _user.Mutation, _role.Mutation)
});