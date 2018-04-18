'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Media = exports.MediaMeta = exports.MediaType = undefined;

var _graphql = require('graphql');

var _user = require('./user');

var MediaType = exports.MediaType = new _graphql.GraphQLEnumType({
  name: 'MediaType',
  values: {
    IMAGE: { value: 'image' },
    FILE: { value: 'file' }
  }
});

var MediaMeta = exports.MediaMeta = new _graphql.GraphQLObjectType({
  name: 'MediaMeta',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      value: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) }
    };
  }
});

var Media = exports.Media = new _graphql.GraphQLObjectType({
  name: 'Media',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      url: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      type: { type: (0, _graphql.GraphQLNonNull)(MediaType) },
      uploadDate: {
        type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
        resolve: function resolve(media) {
          return media.upload_date;
        }
      },
      uploadBy: {
        type: (0, _graphql.GraphQLNonNull)(_user.User),
        resolve: function resolve(media) {
          return userData.find(function (item) {
            return item.id === media.upload_by;
          });
        }
      },
      mediaMeta: {
        type: (0, _graphql.GraphQLList)(MediaMeta),
        resolve: function resolve(media) {
          return media;
        }
      }
    };
  }
});