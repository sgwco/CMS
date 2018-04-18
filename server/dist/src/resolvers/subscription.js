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
  subscriptions: {
    type: new _graphql.GraphQLList(_models.Subscription),
    resolve: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'subscription');

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
  subscription: {
    type: _models.Subscription,
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
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'subscription WHERE id=\'' + id + '\'');

              case 2:
                rows = _context2.sent;

                if (!(rows.length > 0)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt('return', rows[0]);

              case 7:
                throw new _graphql.GraphQLError('Subscription does not exist');

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
  createSubscription: {
    type: _models.Subscription,
    args: {
      user_id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      package_id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      duration: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLInt) },
      subscribeDate: { type: _graphql.GraphQLString },
      status: { type: _graphql.GraphQLInt }
    },
    resolve: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(source, args) {
        var subscribeDate, status, id;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (args.user_id) {
                  _context3.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('User cannot be null');

              case 2:
                if (args.package_id) {
                  _context3.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('Package cannot be null');

              case 4:
                if (args.duration) {
                  _context3.next = 6;
                  break;
                }

                throw new _graphql.GraphQLError('Duration cannot be null');

              case 6:
                subscribeDate = args.subscribeDate || (0, _moment2.default)().format('YYYY-MM-DD HH:MM');
                status = args.status || _models.SubscriptionStatus.getValue('ACTIVE').value;
                id = _uuid2.default.v1();
                _context3.prev = 9;
                _context3.next = 12;
                return (0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'subscription VALUES (\n          \'' + id + '\',\n          \'' + args.user_id + '\',\n          \'' + args.package_id + '\',\n          ' + args.duration + ',\n          \'' + subscribeDate + '\',\n          \'' + status + '\'\n        )');

              case 12:
                _context3.next = 17;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3['catch'](9);
                throw new _graphql.GraphQLError('Subscription data invalid');

              case 17:
                return _context3.abrupt('return', {
                  id: id,
                  user_id: args.user_id,
                  package_id: args.package_id,
                  duration: args.duration,
                  subscribe_date: subscribeDate,
                  status: status
                });

              case 18:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[9, 14]]);
      }));

      return function resolve(_x3, _x4) {
        return _ref4.apply(this, arguments);
      };
    }()
  },
  editSubscription: {
    type: _models.Subscription,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      user_id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      package_id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      duration: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLInt) },
      subscribeDate: { type: _graphql.GraphQLString },
      status: { type: _graphql.GraphQLInt }
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

                throw new _graphql.GraphQLError('Edit subscription must have id');

              case 2:
                if (args.user_id) {
                  _context4.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('User cannot be null');

              case 4:
                if (args.package_id) {
                  _context4.next = 6;
                  break;
                }

                throw new _graphql.GraphQLError('Package cannot be null');

              case 6:
                if (args.duration) {
                  _context4.next = 8;
                  break;
                }

                throw new _graphql.GraphQLError('Duration cannot be null');

              case 8:
                listArgs = Object.keys(args).filter(function (item) {
                  return item !== 'id';
                });
                setStatement = listArgs.map(function (item) {
                  return (0, _utils.convertCamelCaseToSnakeCase)(item) + '=\'' + args[item] + '\'';
                }).join(',');
                _context4.prev = 10;
                _context4.next = 13;
                return (0, _database.promiseQuery)('UPDATE ' + _database.PREFIX + 'subscription SET ' + setStatement + ' WHERE id=\'' + args.id + '\'');

              case 13:
                _context4.next = 22;
                break;

              case 15:
                _context4.prev = 15;
                _context4.t0 = _context4['catch'](10);

                console.log('UPDATE ' + _database.PREFIX + 'subscription SET ' + setStatement + ' WHERE id=\'' + args.id + '\'');
                _context4.t1 = _context4.t0.code;
                _context4.next = _context4.t1 === 'ER_NO_REFERENCED_ROW_2' ? 21 : 22;
                break;

              case 21:
                throw new _graphql.GraphQLError('Subscription data invalid');

              case 22:

                context.dataloaders.subscriptionsByIds.clear(args.id);
                return _context4.abrupt('return', context.dataloaders.subscriptionsByIds.load(args.id));

              case 24:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined, [[10, 15]]);
      }));

      return function resolve(_x5, _x6, _x7) {
        return _ref5.apply(this, arguments);
      };
    }()
  },
  removeSubscription: {
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

                (0, _database.promiseQuery)('DELETE FROM ' + _database.PREFIX + 'subscription WHERE id=\'' + args.id + '\'');
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