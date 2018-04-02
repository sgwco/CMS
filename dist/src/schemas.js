'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _data = require('./data');

var UserStatus = new _graphql.GraphQLEnumType({
  name: 'UserStatus',
  values: {
    ACTIVE: { value: 'active' },
    BANNED: { value: 'banned' },
    PENDING: { value: 'pending' }
  }
});

var User = new _graphql.GraphQLObjectType({
  name: 'User',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      username: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      password: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      fullname: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      registrationDate: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      accessPermission: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLInt) },
      address: { type: _graphql.GraphQLString },
      phone: { type: _graphql.GraphQLString },
      userStatus: { type: UserStatus }
    };
  }
});

var MediaType = new _graphql.GraphQLEnumType({
  name: 'MediaType',
  values: {
    IMAGE: { value: 'image' },
    FILE: { value: 'file' }
  }
});

var MediaMeta = new _graphql.GraphQLObjectType({
  name: 'MediaMeta',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      value: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) }
    };
  }
});

var Media = new _graphql.GraphQLObjectType({
  name: 'Media',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      url: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      type: { type: (0, _graphql.GraphQLNonNull)(MediaType) },
      uploadDate: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      uploadBy: {
        type: (0, _graphql.GraphQLNonNull)(User),
        resolve: function resolve(_ref) {
          var uploadBy = _ref.uploadBy;

          return uploadBy;
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

var Category = new _graphql.GraphQLInterfaceType({
  name: 'Category',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      slug: {
        type: _graphql.GraphQLString,
        resolve: function resolve(category) {
          return category.slug;
        }
      },
      description: { type: _graphql.GraphQLString }
    };
  }
});

var PostCategory = new _graphql.GraphQLObjectType({
  name: 'PostCategory',
  interfaces: [Category],
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      slug: {
        type: _graphql.GraphQLString,
        resolve: function resolve(category) {
          return category.slug;
        }
      },
      parent: { type: PostCategory },
      description: { type: _graphql.GraphQLString }
    };
  }
});

var ProductCategory = new _graphql.GraphQLObjectType({
  name: 'ProductCategory',
  interfaces: [Category],
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      slug: {
        type: _graphql.GraphQLString,
        resolve: function resolve(category) {
          return category.slug;
        }
      },
      parent: { type: ProductCategory },
      description: { type: _graphql.GraphQLString }
    };
  }
});

var Post = new _graphql.GraphQLObjectType({
  name: 'Post',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      title: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      content: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      excerpt: { type: _graphql.GraphQLString },
      author: {
        type: (0, _graphql.GraphQLNonNull)(User),
        resolve: function resolve(_ref2) {
          var author = _ref2.author;

          return author;
        }
      },
      slug: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      category: { type: (0, _graphql.GraphQLList)(PostCategory) },
      thumbnail: { type: Media },
      count: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLInt) },
      publishDate: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) }
    };
  }
});

var Product = new _graphql.GraphQLObjectType({
  name: 'Product',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      slug: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      shortDescription: { type: _graphql.GraphQLString },
      longDescription: { type: _graphql.GraphQLString },
      thumbnail: { type: Media },
      gallery: { type: (0, _graphql.GraphQLList)(Media) },
      category: { type: (0, _graphql.GraphQLList)(ProductCategory) },
      price: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLFloat) },
      salePrice: { type: _graphql.GraphQLFloat },
      saleDuration: { type: _graphql.GraphQLString },
      wholesalePrice: { type: _graphql.GraphQLFloat },
      sku: { type: _graphql.GraphQLString },
      stockQuantity: { type: _graphql.GraphQLInt },
      tags: { type: (0, _graphql.GraphQLList)(_graphql.GraphQLString) }
    };
  }
});

var Query = new _graphql.GraphQLObjectType({
  name: 'SGW_Schemas',
  fields: function fields() {
    return {
      users: {
        type: new _graphql.GraphQLList(User),
        resolve: function resolve() {
          return _data.users;
        }
      },
      user: {
        type: User,
        args: {
          id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
        },
        resolve: function resolve(source, _ref3) {
          var id = _ref3.id;

          return _data.users.find(function (item) {
            return item.id === id;
          });
        }
      }
    };
  }
});

var Schema = new _graphql.GraphQLSchema({
  query: Query
});

exports.default = Schema;