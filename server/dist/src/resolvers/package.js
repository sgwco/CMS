'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mutation = exports.Query = undefined;

var _graphql = require('graphql');

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _models = require('../models');

var _database = require('../config/database');

var _utils = require('../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Query = exports.Query = {
  packages: {
    type: new _graphql.GraphQLList(_models.Package),
    resolve: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'package');

              case 2:
                return _context.abrupt('return', _context.sent);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function resolve() {
        return _ref.apply(this, arguments);
      };
    }()
  },
  package: {
    type: _models.Package,
    args: {
      id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
    },
    resolve: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(source, _ref3) {
        var id = _ref3.id;
        var rows;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'package WHERE id=\'' + id + '\'');

              case 2:
                rows = _context2.sent;

                if (!(rows.length > 0)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt('return', rows[0]);

              case 7:
                throw new _graphql.GraphQLError('Package does not exist');

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function resolve(_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }()
  }
};

var Mutation = exports.Mutation = {
  createPackage: {
    type: _models.Package,
    args: {
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      price: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLFloat) },
      interestRate: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLFloat) }
    },
    resolve: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(source, args) {
        var id;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (args.name) {
                  _context3.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Name cannot be null');

              case 2:
                if (!(!args.price || args.price < 0)) {
                  _context3.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('Price invalid');

              case 4:
                if (!(!args.interestRate || args.interestRate < 0)) {
                  _context3.next = 6;
                  break;
                }

                throw new _graphql.GraphQLError('Interest rate invalid');

              case 6:
                id = _uuid2.default.v1();
                _context3.next = 9;
                return (0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'package VALUES (\n        \'' + id + '\',\n        \'' + args.name + '\',\n        ' + args.price + ',\n        ' + args.interestRate + '\n      )');

              case 9:
                return _context3.abrupt('return', {
                  id: id,
                  name: args.name,
                  price: args.price,
                  interest_rate: args.interestRate
                });

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      return function resolve(_x3, _x4) {
        return _ref4.apply(this, arguments);
      };
    }()
  },
  editPackage: {
    type: _models.Package,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: _graphql.GraphQLString },
      price: { type: _graphql.GraphQLFloat },
      interestRate: { type: _graphql.GraphQLFloat }
    },
    resolve: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(source, args, context) {
        var listArgs, setStatement;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (args.id) {
                  _context4.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Edit package must have id');

              case 2:
                if (!(args.name && args.name.length === 0)) {
                  _context4.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('Name cannot be null');

              case 4:
                if (!(args.price && args.price < 0)) {
                  _context4.next = 6;
                  break;
                }

                throw new _graphql.GraphQLError('Price invalid');

              case 6:
                if (!(args.interestRate && args.interestRate < 0)) {
                  _context4.next = 8;
                  break;
                }

                throw new _graphql.GraphQLError('Interest rate invalid');

              case 8:
                listArgs = Object.keys(args).filter(function (item) {
                  return item !== 'id';
                });
                setStatement = listArgs.map(function (item) {
                  return (0, _utils.convertCamelCaseToSnakeCase)(item) + '=\'' + args[item] + '\'';
                }).join(',');
                _context4.next = 12;
                return (0, _database.promiseQuery)('UPDATE ' + _database.PREFIX + 'package SET ' + setStatement + ' WHERE id=\'' + args.id + '\'');

              case 12:
                context.dataloaders.packagesByIds.clear(args.id);

                return _context4.abrupt('return', context.dataloaders.packagesByIds.load(args.id));

              case 14:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined);
      }));

      return function resolve(_x5, _x6, _x7) {
        return _ref5.apply(this, arguments);
      };
    }()
  },
  removePackage: {
    type: _graphql.GraphQLID,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) }
    },
    resolve: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(source, args) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (args.id) {
                  _context5.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Id cannot be null');

              case 2:

                (0, _database.promiseQuery)('DELETE FROM ' + _database.PREFIX + 'package WHERE id=\'' + args.id + '\'');
                return _context5.abrupt('return', args.id);

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined);
      }));

      return function resolve(_x8, _x9) {
        return _ref6.apply(this, arguments);
      };
    }()
  }
};