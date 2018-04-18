'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _models = require('../models');

exports.default = {
  categories: {
    type: new _graphql.GraphQLList(_models.Category),
    resolve: function resolve() {
      return categoryData;
    }
  },
  media: {
    type: _models.Category,
    args: {
      id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
    },
    resolve: function resolve(source, _ref) {
      var id = _ref.id;

      return categoryData.find(function (item) {
        return item.id === id;
      });
    }
  }
};