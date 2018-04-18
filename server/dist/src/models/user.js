'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = exports.UserStatus = undefined;

var _graphql = require('graphql');

var _role = require('./role');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var UserStatus = exports.UserStatus = new _graphql.GraphQLEnumType({
  name: 'UserStatus',
  values: {
    ACTIVE: { value: 'active' },
    BANNED: { value: 'banned' },
    PENDING: { value: 'pending' }
  }
});

var User = exports.User = new _graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
    username: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
    password: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
    fullname: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
    email: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
    registrationDate: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      resolve: function resolve(_ref) {
        var registration_date = _ref.registration_date;

        return registration_date;
      }
    },
    role: {
      type: (0, _graphql.GraphQLNonNull)(_role.Role),
      resolve: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3, _, context) {
          var role = _ref3.role;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt('return', context.dataloaders.rolesByIds.load(role));

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
    address: { type: _graphql.GraphQLString },
    phone: { type: _graphql.GraphQLString },
    userStatus: {
      type: UserStatus,
      resolve: function resolve(_ref4) {
        var user_status = _ref4.user_status;

        return user_status;
      }
    }
  }
});