'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mutation = exports.Query = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _graphql = require('graphql');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _models = require('../models');

var _database = require('../config/database');

var _utils = require('../utils/utils');

var _enum = require('../enum');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Query = exports.Query = {
  packages: {
    type: new _graphql.GraphQLList(_models.Package),
    resolve: function resolve(source, args, _ref) {
      var _this = this;

      var payload = _ref.payload;
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (payload) {
                  _context.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Unauthorized');

              case 2:
                _context.next = 4;
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'package');

              case 4:
                return _context.abrupt('return', _context.sent);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }))();
    }
  },
  package: {
    type: _models.Package,
    args: {
      id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
    },
    resolve: function resolve(source, _ref2, _ref3) {
      var _this2 = this;

      var id = _ref2.id;
      var payload = _ref3.payload;
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var rows;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (payload) {
                  _context2.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Unauthorized');

              case 2:
                _context2.next = 4;
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'package WHERE id=\'' + id + '\'');

              case 4:
                rows = _context2.sent;

                if (!(rows.length > 0)) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt('return', rows[0]);

              case 9:
                throw new _graphql.GraphQLError('Package does not exist');

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }))();
    }
  },
  activePackage: {
    type: (0, _graphql.GraphQLList)(_models.Package),
    resolve: function resolve(source, _, _ref4) {
      var _this3 = this;

      var payload = _ref4.payload;
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var activePackage;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (payload) {
                  _context3.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Unauthorized');

              case 2:
                _context3.next = 4;
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'package WHERE user_id=\'' + payload.id + '\'');

              case 4:
                activePackage = _context3.sent;

                if (!(activePackage.length > 0)) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt('return', activePackage);

              case 9:
                throw new _graphql.GraphQLError('Package does not exist');

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this3);
      }))();
    }
  }
};

var Mutation = exports.Mutation = {
  createPackage: {
    type: _models.Package,
    args: {
      userId: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      price: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLInt) },
      duration: { type: (0, _graphql.GraphQLNonNull)(_models.PackageDuration) },
      registerDate: { type: _graphql.GraphQLString }
    },
    resolve: function resolve(source, args, _ref5) {
      var _this4 = this;

      var payload = _ref5.payload,
          dataloaders = _ref5.dataloaders;
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var now, registerDate, status, id, lastId, transferMoneyProgresses, duration, paymentDate, index;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (payload) {
                  _context4.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Unauthorized');

              case 2:
                if (args.userId) {
                  _context4.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('User cannot be null');

              case 4:
                if (!(!args.price || args.price < 0)) {
                  _context4.next = 6;
                  break;
                }

                throw new _graphql.GraphQLError('Price invalid');

              case 6:
                if (args.duration) {
                  _context4.next = 8;
                  break;
                }

                throw new _graphql.GraphQLError('Duration cannot be null');

              case 8:
                now = (0, _moment2.default)();
                registerDate = args.registerDate ? (0, _moment2.default)(args.registerDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : now.format('YYYY-MM-DD');
                status = _models.PackageStatus.getValue('PENDING').value;
                id = null;
                _context4.next = 14;
                return (0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'package VALUES (\n        NULL,\n        \'' + args.userId + '\',\n        \'' + args.price + '\',\n        \'' + _enum.CURRENCY.VND + '\',\n        \'' + args.duration + '\',\n        \'' + registerDate + '\',\n        \'' + status + '\'\n      )');

              case 14:
                _context4.next = 16;
                return (0, _database.promiseQuery)('SELECT LAST_INSERT_ID()');

              case 16:
                lastId = _context4.sent;

                if (!(lastId.length > 0)) {
                  _context4.next = 21;
                  break;
                }

                id = lastId[0]['LAST_INSERT_ID()'];
                _context4.next = 22;
                break;

              case 21:
                throw new _graphql.GraphQLError('Cannot insert new role.');

              case 22:
                transferMoneyProgresses = {
                  '6': { interestRate: 6, step: 2 },
                  '12': { interestRate: 8, step: 4 }
                };
                duration = transferMoneyProgresses[args.duration];
                paymentDate = (0, _moment2.default)(registerDate, 'YYYY-MM-DD');
                index = 0;

              case 26:
                if (!(index < duration.step)) {
                  _context4.next = 33;
                  break;
                }

                paymentDate = paymentDate.add(3, 'months');
                _context4.next = 30;
                return (0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'package_progress VALUES (\n          NULL,\n          \'' + id + '\',\n          \'' + args.price * duration.interestRate / 100 + '\',\n          \'' + duration.interestRate + '\',\n          \'' + paymentDate.format('YYYY-MM-DD') + '\',\n          0,\n          NULL\n        )');

              case 30:
                index += 1;
                _context4.next = 26;
                break;

              case 33:
                return _context4.abrupt('return', {
                  id: id,
                  status: status,
                  user_id: args.userId,
                  name: args.name,
                  price: args.price,
                  currency: _enum.CURRENCY.VND,
                  duration: args.duration,
                  register_date: args.registerDate || now.format('DD/MM/YYYY'),
                  transferMoney: id
                });

              case 34:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this4);
      }))();
    }
  },
  editPackage: {
    type: _models.Package,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      userId: { type: _graphql.GraphQLID },
      price: { type: _graphql.GraphQLInt },
      duration: { type: _models.PackageDuration },
      registerDate: { type: _graphql.GraphQLString },
      status: { type: _models.PackageStatus }
    },
    resolve: function resolve(source, args, _ref6) {
      var _this5 = this;

      var payload = _ref6.payload,
          dataloaders = _ref6.dataloaders;
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var currentPackage, withdrawDate, packageProgressPromises, index, listArgs, setStatement;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (payload) {
                  _context5.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Unauthorized');

              case 2:
                if (args.id) {
                  _context5.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('Edit package must have id');

              case 4:
                if (!(args.price && args.price < 0)) {
                  _context5.next = 6;
                  break;
                }

                throw new _graphql.GraphQLError('Price invalid');

              case 6:
                if (!(args.duration && args.duration === _models.PackageDuration.getValue('MONTH_12').value)) {
                  _context5.next = 15;
                  break;
                }

                _context5.next = 9;
                return dataloaders.packagesByIds.load(args.id);

              case 9:
                currentPackage = _context5.sent;
                withdrawDate = (0, _moment2.default)(currentPackage.register_date).add(6, 'months');
                packageProgressPromises = [];


                for (index = 0; index < 2; index += 1) {
                  withdrawDate = withdrawDate.add(3, 'months');
                  packageProgressPromises.push((0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'package_progress VALUES(\n              NULL,\n              \'' + args.id + '\',\n              \'' + currentPackage.price * 0.08 + '\',\n              \'8\',\n              \'' + withdrawDate.format('YYYY-MM-DD') + '\',\n              \'0\',\n              NULL\n            )'));
                }

                _context5.next = 15;
                return Promise.all(packageProgressPromises);

              case 15:
                listArgs = Object.keys(args).filter(function (item) {
                  return item !== 'id';
                });

                if (args.registerDate) args.registerDate = (0, _moment2.default)(args.registerDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

                setStatement = listArgs.map(function (item) {
                  return (0, _utils.convertCamelCaseToSnakeCase)(item) + '=\'' + args[item] + '\'';
                }).join(',');
                _context5.next = 20;
                return (0, _database.promiseQuery)('UPDATE ' + _database.PREFIX + 'package SET ' + setStatement + ' WHERE id=\'' + args.id + '\'');

              case 20:
                dataloaders.packagesByIds.clear(args.id);

                _context5.t0 = _extends;
                _context5.t1 = {};
                _context5.next = 25;
                return dataloaders.packagesByIds.load(args.id);

              case 25:
                _context5.t2 = _context5.sent;
                _context5.t3 = {
                  transferMoney: args.id
                };
                return _context5.abrupt('return', (0, _context5.t0)(_context5.t1, _context5.t2, _context5.t3));

              case 28:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this5);
      }))();
    }
  },
  removePackage: {
    type: _graphql.GraphQLID,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) }
    },
    resolve: function resolve(source, args, _ref7) {
      var _this6 = this;

      var payload = _ref7.payload;
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (payload) {
                  _context6.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Unauthorized');

              case 2:
                if (args.id) {
                  _context6.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('Id cannot be null');

              case 4:

                (0, _database.promiseQuery)('DELETE FROM ' + _database.PREFIX + 'package WHERE id=\'' + args.id + '\'');
                return _context6.abrupt('return', args.id);

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, _this6);
      }))();
    }
  },
  editPackageProgress: {
    type: _models.Package,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      amount: { type: _graphql.GraphQLInt },
      interestRate: { type: _graphql.GraphQLInt },
      date: { type: _graphql.GraphQLString },
      status: { type: _graphql.GraphQLBoolean },
      withdrawDate: { type: _graphql.GraphQLString }
    },
    resolve: function resolve(source, args, _ref8) {
      var _this7 = this;

      var payload = _ref8.payload,
          dataloaders = _ref8.dataloaders;
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var listArgs, setStatement, packageProgress;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (payload) {
                  _context7.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Unauthorized');

              case 2:
                if (args.id) {
                  _context7.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('Id cannot be null');

              case 4:

                args.status = args.status ? 1 : 0;
                if (args.withdrawDate) args.withdrawDate = (0, _moment2.default)(args.withdrawDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

                listArgs = Object.keys(args).filter(function (item) {
                  return item !== 'id';
                });
                setStatement = listArgs.map(function (item) {
                  return (0, _utils.convertCamelCaseToSnakeCase)(item) + '=\'' + args[item] + '\'';
                }).join(',');
                _context7.next = 10;
                return (0, _database.promiseQuery)('UPDATE ' + _database.PREFIX + 'package_progress SET ' + setStatement + ' WHERE id=\'' + args.id + '\'');

              case 10:
                dataloaders.packageProgressesByIds.clear(args.id);
                _context7.next = 13;
                return dataloaders.packageProgressesByIds.load(args.id);

              case 13:
                packageProgress = _context7.sent;
                return _context7.abrupt('return', dataloaders.packagesByIds.load(packageProgress.package_id));

              case 15:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, _this7);
      }))();
    }
  }
};