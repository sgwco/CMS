'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PackageTransferMoneyProgress = exports.Package = exports.PackageStatus = exports.PackageCurrency = exports.PackageDuration = undefined;

var _graphql = require('graphql');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _user = require('./user');

var _database = require('../config/database');

var _enum = require('../enum');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var PackageDuration = exports.PackageDuration = new _graphql.GraphQLEnumType({
  name: 'PackageDuration',
  values: _lodash2.default.transform(_enum.PACKAGE_DURATION, function (result, value, key) {
    return result[key] = { value: value };
  })
});

var PackageCurrency = exports.PackageCurrency = new _graphql.GraphQLEnumType({
  name: 'PackageCurrency',
  values: _lodash2.default.transform(_enum.CURRENCY, function (result, value, key) {
    return result[key] = { value: value };
  })
});

var PackageStatus = exports.PackageStatus = new _graphql.GraphQLEnumType({
  name: 'PackageStatus',
  values: _lodash2.default.transform(_enum.PACKAGE_STATUS, function (result, value, key) {
    return result[key] = { value: value };
  })
});

var Package = exports.Package = new _graphql.GraphQLObjectType({
  name: 'Package',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      user: {
        type: (0, _graphql.GraphQLNonNull)(_user.User),
        resolve: function resolve(_ref, _, context) {
          var user_id = _ref.user_id;

          return context.dataloaders.usersByIds.load(user_id);
        }
      },
      price: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLFloat) },
      currency: { type: (0, _graphql.GraphQLNonNull)(PackageCurrency) },
      duration: { type: (0, _graphql.GraphQLNonNull)(PackageDuration) },
      registerDate: {
        type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
        resolve: function resolve(_ref2) {
          var register_date = _ref2.register_date;

          return register_date;
        }
      },
      status: { type: (0, _graphql.GraphQLNonNull)(PackageStatus) },
      transferMoney: {
        type: (0, _graphql.GraphQLNonNull)((0, _graphql.GraphQLList)(PackageTransferMoneyProgress)),
        resolve: function resolve(_ref3, _, context) {
          var id = _ref3.id;

          var _this = this;

          return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt('return', (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'package_progress WHERE package_id=\'' + id + '\''));

                  case 2:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this);
          }))();
        }
      }
    };
  }
});

var PackageTransferMoneyProgress = exports.PackageTransferMoneyProgress = new _graphql.GraphQLObjectType({
  name: 'PackageTransferMoneyProgress',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      amount: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLFloat) },
      interestRate: {
        type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLInt),
        resolve: function resolve(_ref4) {
          var interest_rate = _ref4.interest_rate;

          return interest_rate;
        }
      },
      date: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      status: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLBoolean) },
      withdrawDate: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref5) {
          var withdraw_date = _ref5.withdraw_date;

          return withdraw_date;
        }
      }
    };
  }
});