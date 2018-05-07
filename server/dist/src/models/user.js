'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = exports.UserMeta = exports.UserStatus = undefined;

var _graphql = require('graphql');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _role = require('./role');

var _database = require('../config/database');

var _enum = require('../enum');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var UserStatus = exports.UserStatus = new _graphql.GraphQLEnumType({
  name: 'UserStatus',
  values: _lodash2.default.transform(_enum.USER_STATUS, function (result, value, key) {
    return result[key] = { value: value };
  })
});

var UserMeta = exports.UserMeta = new _graphql.GraphQLObjectType({
  name: 'UserMeta',
  fields: {
    id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
    userId: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      resolve: function resolve(_ref) {
        var user_id = _ref.user_id;

        return user_id;
      }
    },
    metaKey: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      resolve: function resolve(_ref2) {
        var meta_key = _ref2.meta_key;

        return meta_key;
      }
    },
    metaValue: {
      type: _graphql.GraphQLString,
      resolve: function resolve(_ref3) {
        var meta_value = _ref3.meta_value;

        return meta_value;
      }
    }
  }
});

var User = exports.User = new _graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
    username: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
    password: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
    fullname: { type: _graphql.GraphQLString },
    email: { type: _graphql.GraphQLString },
    registrationDate: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      resolve: function resolve(_ref4) {
        var registration_date = _ref4.registration_date;

        return registration_date;
      }
    },
    role: {
      type: (0, _graphql.GraphQLNonNull)(_role.Role),
      resolve: function resolve(_ref5, _, _ref6) {
        var role = _ref5.role;

        var _this = this;

        var dataloaders = _ref6.dataloaders;
        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt('return', dataloaders.rolesByIds.load(role));

                case 1:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }))();
      }
    },
    address: { type: _graphql.GraphQLString },
    phone: { type: _graphql.GraphQLString },
    userStatus: {
      type: UserStatus,
      resolve: function resolve(_ref7) {
        var user_status = _ref7.user_status;

        return user_status;
      }
    },
    userMeta: {
      type: (0, _graphql.GraphQLList)(UserMeta),
      resolve: function resolve(_ref8) {
        var id = _ref8.id;

        return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'user_meta WHERE user_id=\'' + id + '\'');
      }
    }
  }
});