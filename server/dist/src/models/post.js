'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Product = exports.Post = undefined;

var _graphql = require('graphql');

var _media = require('./media');

var _user = require('./user');

var _category = require('./category');

var Post = exports.Post = new _graphql.GraphQLObjectType({
  name: 'Post',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      title: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      content: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      excerpt: { type: _graphql.GraphQLString },
      author: {
        type: (0, _graphql.GraphQLNonNull)(_user.User),
        resolve: function resolve(_ref) {
          var author = _ref.author;

          return userData.find(function (item) {
            return item.id === author;
          });
        }
      },
      slug: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      category: {
        type: (0, _graphql.GraphQLList)(_category.Category),
        resolve: function resolve(_ref2) {
          var category = _ref2.category;

          return categoryData.filter(function (item) {
            return item.id === category;
          });
        }
      },
      thumbnail: { type: _media.Media },
      count: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLInt) },
      publishDate: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) }
    };
  }
});

var Product = exports.Product = new _graphql.GraphQLObjectType({
  name: 'Product',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      slug: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      shortDescription: { type: _graphql.GraphQLString },
      longDescription: { type: _graphql.GraphQLString },
      thumbnail: { type: _media.Media },
      gallery: { type: (0, _graphql.GraphQLList)(_media.Media) },
      category: { type: (0, _graphql.GraphQLList)(_category.Category) },
      price: { type: (0, _graphql.GraphQLNonNull)(GraphQLFloat) },
      salePrice: { type: GraphQLFloat },
      saleDuration: { type: _graphql.GraphQLString },
      wholesalePrice: { type: GraphQLFloat },
      sku: { type: _graphql.GraphQLString },
      stockQuantity: { type: _graphql.GraphQLInt },
      tags: { type: (0, _graphql.GraphQLList)(_graphql.GraphQLString) }
    };
  }
});