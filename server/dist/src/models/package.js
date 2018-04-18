'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subscription = exports.Package = exports.SubscriptionStatus = exports.SubscriptionDuration = undefined;

var _graphql = require('graphql');

var _user = require('./user');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var SubscriptionDuration = exports.SubscriptionDuration = new _graphql.GraphQLEnumType({
  name: 'SubscriptionDuration',
  values: {
    MONTH_3: { value: 3 },
    MONTH_6: { value: 6 },
    MONTH_9: { value: 9 },
    MONTH_12: { value: 12 }
  }
});

var SubscriptionStatus = exports.SubscriptionStatus = new _graphql.GraphQLEnumType({
  name: 'SubscriptionStatus',
  values: {
    ACTIVE: { value: 'active' },
    PENDING: { value: 'pending' },
    EXPIRED: { value: 'expired' }
  }
});

var Package = exports.Package = new _graphql.GraphQLObjectType({
  name: 'Package',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      name: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      price: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLFloat) },
      interestRate: {
        type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLFloat),
        resolve: function resolve(_ref) {
          var interest_rate = _ref.interest_rate;
          return interest_rate;
        }
      }
    };
  }
});

var Subscription = exports.Subscription = new _graphql.GraphQLObjectType({
  name: 'Subscription',
  fields: function fields() {
    return {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      user_id: {
        type: (0, _graphql.GraphQLNonNull)(_user.User),
        resolve: function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3, _, context) {
            var user_id = _ref3.user_id;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt('return', context.dataloaders.usersByIds.load(user_id));

                  case 1:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined);
          }));

          return function resolve(_x, _x2, _x3) {
            return _ref2.apply(this, arguments);
          };
        }()
      },
      package_id: {
        type: (0, _graphql.GraphQLNonNull)(Package),
        resolve: function () {
          var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref5, _, context) {
            var package_id = _ref5.package_id;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    return _context2.abrupt('return', context.dataloaders.packagesByIds.load(package_id));

                  case 1:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, undefined);
          }));

          return function resolve(_x4, _x5, _x6) {
            return _ref4.apply(this, arguments);
          };
        }()
      },
      duration: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLInt) },
      subscribeDate: {
        type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
        resolve: function resolve(_ref6) {
          var subscribe_date = _ref6.subscribe_date;
          return subscribe_date;
        }
      },
      status: { type: (0, _graphql.GraphQLNonNull)(SubscriptionStatus) }
    };
  }
});