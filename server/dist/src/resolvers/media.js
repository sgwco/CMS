'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _models = require('../models');

exports.default = {
  medias: {
    type: new _graphql.GraphQLList(_models.Media),
    resolve: function resolve() {
      return mediaData;
    }
  },
  media: {
    type: _models.Media,
    args: {
      id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
    },
    resolve: function resolve(source, _ref) {
      var id = _ref.id;

      return mediaData.find(function (item) {
        return item.id === id;
      });
    }
  }
};