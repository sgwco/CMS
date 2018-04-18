'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mutation = exports.Query = undefined;

var _graphql = require('graphql');

var _models = require('../models');

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _database = require('../config/database');

var _utils = require('../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Query = exports.Query = {
  categories: {
    type: new _graphql.GraphQLList(_models.Category),
    resolve: function resolve() {
      return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'category');
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

var Mutation = exports.Mutation = {
  createCategory: {
    type: _models.Category,
    args: {
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      slug: { type: _graphql.GraphQLString, defaultValue: '' },
      parent: { type: _graphql.GraphQLString, defaultValue: '' },
      description: { type: _graphql.GraphQLString, defaultValue: '' },
      thumbnail: { type: _graphql.GraphQLString, defaultValue: '' }
    },
    resolve: function resolve(source, args, context) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var name, slug, parent, description, thumbnail, id;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                name = args.name, slug = args.slug, parent = args.parent, description = args.description, thumbnail = args.thumbnail;

                if (name) {
                  _context.next = 3;
                  break;
                }

                throw new GraphQLError('Name cannot be null');

              case 3:
                id = _uuid2.default.v1();
                _context.prev = 4;
                _context.next = 7;
                return (0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'category VALUES (\n          \'' + id + '\',\n          \'' + name + '\',\n          \'' + slug + '\',\n          \'' + parent + '\',\n          \'' + description + '\',\n          \'' + thumbnail + '\'\n        )');

              case 7:
                _context.next = 17;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](4);

                console.log(_context.t0);
                _context.t1 = _context.t0.code;
                _context.next = _context.t1 === 'ER_DUP_ENTRY' ? 15 : _context.t1 === 'ER_NO_REFERENCED_ROW_2' ? 16 : 17;
                break;

              case 15:
                throw new GraphQLError('Category existed');

              case 16:
                throw new GraphQLError('Category data invalid');

              case 17:
                return _context.abrupt('return', {
                  id: id,
                  name: name,
                  slug: slug,
                  parent: parent,
                  description: description,
                  thumbnail: thumbnail
                });

              case 18:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[4, 9]]);
      }))();
    }
  },
  editCategory: {
    type: _models.Category,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      slug: { type: _graphql.GraphQLString },
      parent: { type: _graphql.GraphQLString },
      description: { type: _graphql.GraphQLString },
      thumbnail: { type: _graphql.GraphQLString }
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

                throw new GraphQLError('Id cannot be null');

              case 2:
                if (args.name) {
                  _context2.next = 4;
                  break;
                }

                throw new GraphQLError('Name cannot be null');

              case 4:
                listArgs = Object.keys(args).filter(function (item) {
                  return item !== 'id';
                });
                setStatement = listArgs.map(function (item) {
                  return (0, _utils.convertCamelCaseToSnakeCase)(item) + '=\'' + args[item] + '\'';
                }).join(',');
                _context2.prev = 6;
                _context2.next = 9;
                return (0, _database.promiseQuery)('UPDATE ' + _database.PREFIX + 'category SET ' + setStatement + ' WHERE id=\'' + args.id + '\'');

              case 9:
                _context2.next = 18;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2['catch'](6);
                _context2.t1 = _context2.t0.code;
                _context2.next = _context2.t1 === 'ER_DUP_ENTRY' ? 16 : _context2.t1 === 'ER_NO_REFERENCED_ROW_2' ? 17 : 18;
                break;

              case 16:
                throw new GraphQLError('Category existed');

              case 17:
                throw new GraphQLError('Category data invalid');

              case 18:
                context.dataloaders.categoriesByIds.clear(args.id);
                return _context2.abrupt('return', context.dataloaders.categoriesByIds.load(args.id));

              case 20:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[6, 11]]);
      }))();
    }
  },
  removeCategory: {
    type: _graphql.GraphQLID,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) }
    },
    resolve: function resolve(source, args, context) {
      var id = args.id;


      if (!id) {
        throw new GraphQLError('Id cannot be null');
      }

      (0, _database.promiseQuery)('DELETE FROM ' + _database.PREFIX + 'category WHERE id=\'' + args.id + '\'');
      return args.id;
    }
  }
};