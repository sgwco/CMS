'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Media = exports.MediaMeta = undefined;

var _graphql = require('graphql');

var _user = require('./user');

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
      url: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
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
      }
    };
  }
});