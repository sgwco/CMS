'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mutation = exports.Query = undefined;

var _graphql = require('graphql');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _isEmail = require('validator/lib/isEmail');

var _isEmail2 = _interopRequireDefault(_isEmail);

var _sha = require('sha1');

var _sha2 = _interopRequireDefault(_sha);

var _models = require('../models');

var _database = require('../config/database');

var _auth = require('../config/auth');

var _utils = require('../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Query = exports.Query = {
  users: {
    type: new _graphql.GraphQLList(_models.User),
    resolve: function resolve(source, args, _ref) {
      var payload = _ref.payload;

      if (!payload) {
        throw new _graphql.GraphQLError('Unauthorized');
      }

      return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'user');
    }
  },
  user: {
    type: _models.User,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) }
    },
    resolve: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(source, _ref3, _ref4) {
        var id = _ref3.id;
        var payload = _ref4.payload;
        var rows;
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
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'user WHERE id=\'' + id + '\'');

              case 4:
                rows = _context.sent;

                if (!(rows.length > 0)) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt('return', rows[0]);

              case 7:
                throw new _graphql.GraphQLError('error.user_not_exist');

              case 8:
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
  loggedInUser: {
    type: _models.User,
    resolve: function resolve(source, _, _ref5) {
      var _this = this;

      var payload = _ref5.payload,
          dataloaders = _ref5.dataloaders;
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
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
                return _context2.abrupt('return', dataloaders.usersByIds.load(payload.id));

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      }))();
    }
  }
};

var Mutation = exports.Mutation = {
  createUser: {
    type: _models.User,
    args: {
      username: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      password: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      role: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      email: { type: _graphql.GraphQLString },
      fullname: { type: _graphql.GraphQLString },
      address: { type: _graphql.GraphQLString },
      phone: { type: _graphql.GraphQLString },
      userMeta: { type: _graphql.GraphQLString }
    },
    resolve: function resolve(source, args, context) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var username, password, email, role, address, phone, fullname, registrationDate, id, lastId, userMeta, userMetaPromises, index;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (context.payload) {
                  _context3.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('Unauthorized');

              case 2:
                username = args.username, password = args.password, email = args.email, role = args.role, address = args.address, phone = args.phone, fullname = args.fullname;

                if (username) {
                  _context3.next = 5;
                  break;
                }

                throw new _graphql.GraphQLError('error.username_null');

              case 5:
                if (password) {
                  _context3.next = 7;
                  break;
                }

                throw new _graphql.GraphQLError('error.password_null');

              case 7:
                if (!(email && !(0, _isEmail2.default)(email))) {
                  _context3.next = 9;
                  break;
                }

                throw new _graphql.GraphQLError('error.email_invalid');

              case 9:
                if (role) {
                  _context3.next = 11;
                  break;
                }

                throw new _graphql.GraphQLError('error.role_null');

              case 11:
                registrationDate = (0, _moment2.default)().format('YYYY-MM-DD HH:MM');
                id = null;
                _context3.prev = 13;
                _context3.next = 16;
                return (0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'user VALUES (\n          NULL,\n          \'' + username + '\',\n          \'' + password + '\',\n          \'' + (fullname || '') + '\',\n          \'' + (email || '') + '\',\n          \'' + registrationDate + '\',\n          \'' + role + '\',\n          \'' + (address || '') + '\',\n          \'' + (phone || '') + '\',\n          \'' + _models.UserStatus.getValue('ACTIVE').value + '\'\n        )');

              case 16:
                _context3.next = 25;
                break;

              case 18:
                _context3.prev = 18;
                _context3.t0 = _context3['catch'](13);
                _context3.t1 = _context3.t0.code;
                _context3.next = _context3.t1 === 'ER_DUP_ENTRY' ? 23 : _context3.t1 === 'ER_NO_REFERENCED_ROW_2' ? 24 : 25;
                break;

              case 23:
                throw new _graphql.GraphQLError('error.user_exist');

              case 24:
                throw new _graphql.GraphQLError('error.data_invalid');

              case 25:
                _context3.next = 27;
                return (0, _database.promiseQuery)('SELECT LAST_INSERT_ID()');

              case 27:
                lastId = _context3.sent;

                if (!(lastId.length > 0)) {
                  _context3.next = 32;
                  break;
                }

                id = lastId[0]['LAST_INSERT_ID()'];
                _context3.next = 33;
                break;

              case 32:
                throw new _graphql.GraphQLError('error.cannot_insert');

              case 33:
                if (!args.userMeta) {
                  _context3.next = 39;
                  break;
                }

                userMeta = JSON.parse(args.userMeta);
                userMetaPromises = [];

                for (index in userMeta) {
                  userMetaPromises.push((0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'user_meta VALUES (\n            NULL,\n            \'' + id + '\',\n            \'' + userMeta[index].metaKey + '\',\n            \'' + userMeta[index].metaValue + '\'\n          )'));
                }
                _context3.next = 39;
                return Promise.all(userMetaPromises);

              case 39:
                return _context3.abrupt('return', {
                  id: lastId[0]['LAST_INSERT_ID()'],
                  username: username,
                  password: password,
                  fullname: fullname,
                  email: email,
                  role: role,
                  address: address,
                  phone: phone,
                  registration_date: registrationDate,
                  user_status: _models.UserStatus.getValue('ACTIVE').value
                });

              case 40:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2, [[13, 18]]);
      }))();
    }
  },
  editUser: {
    type: _models.User,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) },
      password: { type: _graphql.GraphQLString },
      email: { type: _graphql.GraphQLString },
      role: { type: _graphql.GraphQLID },
      fullname: { type: _graphql.GraphQLString },
      address: { type: _graphql.GraphQLString },
      phone: { type: _graphql.GraphQLString },
      userMeta: { type: _graphql.GraphQLString }
    },
    resolve: function resolve(source, args, context) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var setStatement, userMeta, userMetaPromises, existMeta, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (args.id) {
                  _context4.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('error.id_null');

              case 2:
                if (!(args.email && !(0, _isEmail2.default)(args.email))) {
                  _context4.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('error.email_invalid');

              case 4:
                setStatement = Object.keys(args).filter(function (item) {
                  return item !== 'id' && item !== 'userMeta' && args[item];
                }).map(function (item) {
                  return (0, _utils.convertCamelCaseToSnakeCase)(item) + '=\'' + args[item] + '\'';
                }).join(',');
                _context4.prev = 5;
                _context4.next = 8;
                return (0, _database.promiseQuery)('UPDATE ' + _database.PREFIX + 'user SET ' + setStatement + ' WHERE id=\'' + args.id + '\'');

              case 8:
                _context4.next = 17;
                break;

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4['catch'](5);
                _context4.t1 = _context4.t0.code;
                _context4.next = _context4.t1 === 'ER_DUP_ENTRY' ? 15 : _context4.t1 === 'ER_NO_REFERENCED_ROW_2' ? 16 : 17;
                break;

              case 15:
                throw new _graphql.GraphQLError('error.user_exist');

              case 16:
                throw new _graphql.GraphQLError('error.data_invalid');

              case 17:
                if (!args.userMeta) {
                  _context4.next = 45;
                  break;
                }

                userMeta = JSON.parse(args.userMeta);
                userMetaPromises = [];
                _context4.next = 22;
                return (0, _database.promiseQuery)('SELECT * from ' + _database.PREFIX + 'user_meta WHERE user_id=\'' + args.id + '\'');

              case 22:
                existMeta = _context4.sent;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 26;

                _loop = function _loop() {
                  var meta = _step.value;

                  if (existMeta.length === 0 || existMeta.findIndex(function (item) {
                    return item.meta_key === meta.metaKey;
                  }) === -1) {
                    userMetaPromises.push((0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'user_meta VALUES(NULL, \'' + args.id + '\', \'' + meta.metaKey + '\', \'' + meta.metaValue + '\')'));
                  } else {
                    userMetaPromises.push((0, _database.promiseQuery)('UPDATE ' + _database.PREFIX + 'user_meta SET meta_value=\'' + meta.metaValue + '\' WHERE user_id=\'' + args.id + '\' AND meta_key=\'' + meta.metaKey + '\''));
                  }
                };

                for (_iterator = userMeta[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  _loop();
                }
                _context4.next = 35;
                break;

              case 31:
                _context4.prev = 31;
                _context4.t2 = _context4['catch'](26);
                _didIteratorError = true;
                _iteratorError = _context4.t2;

              case 35:
                _context4.prev = 35;
                _context4.prev = 36;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 38:
                _context4.prev = 38;

                if (!_didIteratorError) {
                  _context4.next = 41;
                  break;
                }

                throw _iteratorError;

              case 41:
                return _context4.finish(38);

              case 42:
                return _context4.finish(35);

              case 43:
                _context4.next = 45;
                return Promise.all(userMetaPromises);

              case 45:

                context.dataloaders.usersByIds.clear(args.id);

                return _context4.abrupt('return', context.dataloaders.usersByIds.load(args.id));

              case 47:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this3, [[5, 10], [26, 31, 35, 43], [36,, 38, 42]]);
      }))();
    }
  },
  removeUser: {
    type: _graphql.GraphQLID,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) }
    },
    resolve: function resolve(source, args, context) {
      var id = args.id;


      if (!id) {
        throw new _graphql.GraphQLError('error.id_null');
      }

      (0, _database.promiseQuery)('DELETE FROM ' + _database.PREFIX + 'user WHERE id=\'' + args.id + '\'');
      return args.id;
    }
  },
  login: {
    type: _graphql.GraphQLString,
    args: {
      username: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      password: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) }
    },
    resolve: function resolve(source, args, context) {
      var _this4 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var rows, role;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (args.username) {
                  _context5.next = 2;
                  break;
                }

                throw new _graphql.GraphQLError('error.username_null');

              case 2:
                if (args.password) {
                  _context5.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('error.password_null');

              case 4:

                args.password = (0, _sha2.default)(args.password);

                _context5.next = 7;
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'user WHERE username=\'' + args.username + '\' AND password=\'' + args.password + '\'');

              case 7:
                rows = _context5.sent;

                if (!(rows.length > 0)) {
                  _context5.next = 14;
                  break;
                }

                _context5.next = 11;
                return context.dataloaders.rolesByIds.load(rows[0].role);

              case 11:
                role = _context5.sent;

                rows[0].role = role.access_permission;
                return _context5.abrupt('return', (0, _auth.createToken)(rows[0]));

              case 14:
                return _context5.abrupt('return', null);

              case 15:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this4);
      }))();
    }
  }
};