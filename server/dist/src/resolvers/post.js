'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _models = require('../models');

exports.default = {
  posts: {
    type: new _graphql.GraphQLList(_models.Post),
    resolve: function resolve() {
      return postData;
    }
  },
  post: {
    type: _models.Post,
    args: {
      id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
    },
    resolve: function resolve(source, _ref) {
      var id = _ref.id;

      return postData.find(function (item) {
        return item.id === id;
      });
    }
  }
};