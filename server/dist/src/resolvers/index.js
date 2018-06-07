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

var _category = require('./category');

var _package = require('./package');

var _setting = require('./setting');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Query = exports.Query = new _graphql.GraphQLObjectType({
  name: 'SGW_Queries',
  fields: _extends({}, _user.Query, _role.Query, _media2.default, _category.Query, _post.Query, _package.Query, _setting.Query, _media.Query)
});

var Mutation = exports.Mutation = new _graphql.GraphQLObjectType({
  name: 'SGW_Mutations',
  fields: _extends({}, _user.Mutation, _role.Mutation, _post.Mutation, _category.Mutation, _package.Mutation, _setting.Mutation, _media.Mutation)
});