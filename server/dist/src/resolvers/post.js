'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mutation = exports.Query = undefined;

var _graphql = require('graphql');

var _models = require('../models');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _database = require('../config/database');

var _utils = require('../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Query = exports.Query = {
  posts: {
    type: new _graphql.GraphQLList(_models.Post),
    resolve: function resolve() {
      return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'post');
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

var Mutation = exports.Mutation = {
  createPost: {
    type: _models.Post,
    args: {
      title: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      content: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      excerpt: { type: _graphql.GraphQLString, defaultValue: '' },
      author: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      slug: { type: _graphql.GraphQLString, defaultValue: '' },
      category: { type: _graphql.GraphQLString, defaultValue: '' },
      thumbnail: { type: _graphql.GraphQLString, defaultValue: '' },
      count: { type: _graphql.GraphQLInt }
    },
    resolve: function resolve(source, args, context) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var title, content, excerpt, author, slug, category, thumbnail, count, publishDate;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                title = args.title, content = args.content, excerpt = args.excerpt, author = args.author, slug = args.slug, category = args.category, thumbnail = args.thumbnail, count = args.count;

                if (title) {
                  _context.next = 3;
                  break;
                }

                throw new _graphql.GraphQLError('Title cannot be null');

              case 3:
                if (content) {
                  _context.next = 5;
                  break;
                }

                throw new _graphql.GraphQLError('Content cannot be null');

              case 5:
                if (author) {
                  _context.next = 7;
                  break;
                }

                throw new _graphql.GraphQLError('Author cannot be null');

              case 7:
                publishDate = (0, _moment2.default)().format('YYYY-MM-DD HH:MM');
                _context.prev = 8;
                _context.next = 11;
                return (0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'post VALUES (\n          NULL,\n          \'' + title + '\',\n          \'' + content + '\',\n          \'' + excerpt + '\',\n          \'' + author + '\',\n          \'' + slug + '\',\n          \'' + category + '\',\n          \'' + thumbnail + '\',\n          \'' + count + '\',\n          \'' + publishDate + '\'\n        )');

              case 11:
                _context.next = 20;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context['catch'](8);
                _context.t1 = _context.t0.code;
                _context.next = _context.t1 === 'ER_DUP_ENTRY' ? 18 : _context.t1 === 'ER_NO_REFERENCED_ROW_2' ? 19 : 20;
                break;

              case 18:
                throw new _graphql.GraphQLError('Post existed');

              case 19:
                throw new _graphql.GraphQLError('Post data invalid');

              case 20:
                return _context.abrupt('return', {
                  id: id,
                  title: title,
                  content: content,
                  excerpt: excerpt,
                  author: author,
                  slug: slug,
                  category: category,
                  thumbnail: thumbnail,
                  count: count,
                  publish_date: publishDate
                });

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[8, 13]]);
      }))();
    }
  },
  editPost: {
    type: _models.Post,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      title: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      content: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      excerpt: { type: _graphql.GraphQLString },
      author: { type: _graphql.GraphQLID },
      slug: { type: _graphql.GraphQLString },
      category: { type: _graphql.GraphQLString },
      thumbnail: { type: _graphql.GraphQLString },
      count: { type: _graphql.GraphQLInt }
    },
    resolve: function resolve(source, args, context) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var listArgs, setStatement;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (args.id) {
                  _context2.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Id cannot be null');

              case 2:
                if (args.title) {
                  _context2.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('Title cannot be null');

              case 4:
                if (args.content) {
                  _context2.next = 6;
                  break;
                }

                throw new _graphql.GraphQLError('Content cannot be null');

              case 6:
                if (args.author) {
                  _context2.next = 8;
                  break;
                }

                throw new _graphql.GraphQLError('Author cannot be null');

              case 8:
                listArgs = Object.keys(args).filter(function (item) {
                  return item !== 'id';
                });
                setStatement = listArgs.map(function (item) {
                  return (0, _utils.convertCamelCaseToSnakeCase)(item) + '=\'' + args[item] + '\'';
                }).join(',');
                _context2.prev = 10;
                _context2.next = 13;
                return (0, _database.promiseQuery)('UPDATE ' + _database.PREFIX + 'post SET ' + setStatement + ' WHERE id=\'' + args.id + '\'');

              case 13:
                _context2.next = 22;
                break;

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2['catch'](10);
                _context2.t1 = _context2.t0.code;
                _context2.next = _context2.t1 === 'ER_DUP_ENTRY' ? 20 : _context2.t1 === 'ER_NO_REFERENCED_ROW_2' ? 21 : 22;
                break;

              case 20:
                throw new _graphql.GraphQLError('Post existed');

              case 21:
                throw new _graphql.GraphQLError('Post data invalid');

              case 22:
                context.dataloaders.postsByIds.clear(args.id);
                return _context2.abrupt('return', context.dataloaders.postsByIds.load(args.id));

              case 24:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[10, 15]]);
      }))();
    }
  },
  removePost: {
    type: _graphql.GraphQLID,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) }
    },
    resolve: function resolve(source, args, context) {
      var id = args.id;


      if (!id) {
        throw new _graphql.GraphQLError('Id cannot be null');
      }

      (0, _database.promiseQuery)('DELETE FROM ' + _database.PREFIX + 'post WHERE id=\'' + args.id + '\'');
      return args.id;
    }
  }
};