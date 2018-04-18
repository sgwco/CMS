'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Product = exports.Post = undefined;

var _graphql = require('graphql');

var _media = require('./media');

var _user = require('./user');

var _category = require('./category');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Post = exports.Post = new _graphql.GraphQLObjectType({
  name: 'Post',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      title: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      content: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      excerpt: { type: _graphql.GraphQLString },
      author: {
        type: _user.User,
        resolve: function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2, _, context) {
            var author = _ref2.author;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt('return', context.dataloaders.usersByIds.load(author));

                  case 1:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined);
          }));

          return function resolve(_x, _x2, _x3) {
            return _ref.apply(this, arguments);
          };
        }()
      },
      slug: { type: _graphql.GraphQLString },
      category: {
        type: _category.Category,
        resolve: function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref4, _, context) {
            var category = _ref4.category;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    return _context2.abrupt('return', context.dataloaders.categoriesByIds.load(category));

                  case 1:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, undefined);
          }));

          return function resolve(_x4, _x5, _x6) {
            return _ref3.apply(this, arguments);
          };
        }()
      },
      thumbnail: { type: _graphql.GraphQLString },
      count: { type: _graphql.GraphQLInt },
      publishDate: {
        type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
        resolve: function resolve(_ref5) {
          var publish_date = _ref5.publish_date;

          return publish_date;
        }
      }
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