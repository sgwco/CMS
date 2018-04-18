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

var _isEmail = require('validator/lib/isEmail');

var _isEmail2 = _interopRequireDefault(_isEmail);

var _models = require('../models');

var _database = require('../config/database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Query = exports.Query = {
  users: {
    type: new _graphql.GraphQLList(_models.User),
    resolve: function resolve() {
      return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'user');;
    }
  },
  user: {
    type: _models.User,
    args: {
      id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
    },
    resolve: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(source, _ref2) {
        var id = _ref2.id;
        var rows;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'user WHERE id=\'' + id + '\'');

              case 2:
                rows = _context.sent;
                return _context.abrupt('return', rows);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function resolve(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  }
};

var Mutation = exports.Mutation = {
  createUser: {
    type: _models.User,
    args: {
      username: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      password: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      email: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      role: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      fullname: { type: _graphql.GraphQLString, defaultValue: '' },
      address: { type: _graphql.GraphQLString, defaultValue: '' },
      phone: { type: _graphql.GraphQLString, defaultValue: '' }
    },
    resolve: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(source, args, context) {
        var username, password, email, role, address, phone, fullname, roleData, registrationDate, id;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                username = args.username, password = args.password, email = args.email, role = args.role, address = args.address, phone = args.phone, fullname = args.fullname;
                roleData = null;

                if (username) {
                  _context2.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('Username cannot be null');

              case 4:
                if (password) {
                  _context2.next = 6;
                  break;
                }

                throw new _graphql.GraphQLError('Password cannot be null');

              case 6:
                if (email) {
                  _context2.next = 8;
                  break;
                }

                throw new _graphql.GraphQLError('Email cannot be null');

              case 8:
                if ((0, _isEmail2.default)(email)) {
                  _context2.next = 10;
                  break;
                }

                throw new _graphql.GraphQLError('Email invalid');

              case 10:
                if (role) {
                  _context2.next = 12;
                  break;
                }

                throw new _graphql.GraphQLError('Role cannot be null');

              case 12:
                _context2.prev = 12;
                _context2.next = 15;
                return context.dataloaders.rolesByIds.load(role);

              case 15:
                roleData = _context2.sent;
                _context2.next = 21;
                break;

              case 18:
                _context2.prev = 18;
                _context2.t0 = _context2['catch'](12);
                throw new _graphql.GraphQLError('Role invalid');

              case 21:
                registrationDate = (0, _moment2.default)().format('YYYY-MM-DD HH:MM');
                id = _uuid2.default.v1();
                _context2.prev = 23;
                _context2.next = 26;
                return (0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'user VALUES (\n          \'' + id + '\',\n          \'' + username + '\',\n          \'' + password + '\',\n          \'' + fullname + '\',\n          \'' + email + '\',\n          \'' + registrationDate + '\',\n          \'' + role + '\',\n          \'' + address + '\',\n          \'' + phone + '\',\n          \'' + _models.UserStatus.getValue('ACTIVE').value + '\'\n        )');

              case 26:
                _context2.next = 34;
                break;

              case 28:
                _context2.prev = 28;
                _context2.t1 = _context2['catch'](23);
                _context2.t2 = _context2.t1.code;
                _context2.next = _context2.t2 === 'ER_DUP_ENTRY' ? 33 : 34;
                break;

              case 33:
                throw new _graphql.GraphQLError('User existed');

              case 34:
                return _context2.abrupt('return', {
                  id: id,
                  username: username,
                  password: password,
                  fullname: fullname,
                  email: email,
                  role: roleData,
                  address: address,
                  phone: phone,
                  registration_date: registrationDate,
                  user_status: _models.UserStatus.getValue('ACTIVE')
                });

              case 35:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined, [[12, 18], [23, 28]]);
      }));

      return function resolve(_x3, _x4, _x5) {
        return _ref3.apply(this, arguments);
      };
    }()
  }
};