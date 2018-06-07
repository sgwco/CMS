'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mutation = exports.Query = undefined;

var _graphql = require('graphql');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _models = require('../models');

var _database = require('../config/database');

var _utils = require('../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Query = exports.Query = {
  settings: {
    type: new _graphql.GraphQLList(_models.Setting),
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
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'setting');

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
  setting: {
    type: _models.Setting,
    args: {
      settingKeys: { type: new _graphql.GraphQLList(_graphql.GraphQLString) }
    },
    resolve: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(source, _ref3, _ref4) {
        var settingKeys = _ref3.settingKeys;
        var payload = _ref4.payload;
        var querySettingKeys;
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
                if (!_lodash2.default.isEmpty(settingKeys)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return', []);

              case 4:
                querySettingKeys = settingKeys.map(function (key) {
                  return '\'' + key + '\'';
                }).join(', ');
                _context2.next = 7;
                return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'setting WHERE setting_key IN (' + querySettingKeys + ')');

              case 7:
                return _context2.abrupt('return', _context2.sent);

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function resolve(_x, _x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    }()
  }
};

var Mutation = exports.Mutation = {
  createSetting: {
    type: _models.Setting,
    args: {
      settingKey: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      settingValue: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) }
    },
    resolve: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(source, _ref6, _ref7) {
        var settingKey = _ref6.settingKey,
            settingValue = _ref6.settingValue;
        var payload = _ref7.payload;
        var lastId;
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
                if (settingKey) {
                  _context3.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('Setting key cannot be null');

              case 4:
                if (settingValue) {
                  _context3.next = 6;
                  break;
                }

                throw new _graphql.GraphQLError('Setting value cannot be null');

              case 6:
                _context3.next = 8;
                return (0, _database.promiseQuery)('INSERT INTO ' + _database.PREFIX + 'setting VALUES (\n        NULL,\n        \'' + settingKey + '\',\n        \'' + settingValue + '\'\n      )');

              case 8:
                _context3.next = 10;
                return (0, _database.promiseQuery)('SELECT LAST_INSERT_ID()');

              case 10:
                lastId = _context3.sent;

                if (!(lastId.length > 0)) {
                  _context3.next = 15;
                  break;
                }

                return _context3.abrupt('return', {
                  id: lastId[0]['LAST_INSERT_ID()'],
                  setting_key: settingKey,
                  setting_value: settingValue
                });

              case 15:
                throw new _graphql.GraphQLError('error.cannot_insert');

              case 16:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      return function resolve(_x4, _x5, _x6) {
        return _ref5.apply(this, arguments);
      };
    }()
  },
  editSetting: {
    type: (0, _graphql.GraphQLList)(_models.Setting),
    args: {
      listSettings: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) }
    },
    resolve: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(source, _ref9, _ref10) {
        var listSettings = _ref9.listSettings;
        var payload = _ref10.payload,
            dataloaders = _ref10.dataloaders;

        var settings, settingPromises, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, setting;

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
                _context4.prev = 2;
                settings = JSON.parse(listSettings);
                settingPromises = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 8;

                for (_iterator = settings[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  setting = _step.value;

                  settingPromises.push((0, _database.promiseQuery)('UPDATE ' + _database.PREFIX + 'setting SET setting_value=\'' + setting.settingValue + '\' WHERE setting_key=\'' + setting.settingKey + '\''));
                  dataloaders.settingsByKeys.clear(setting.settingKey);
                }
                _context4.next = 16;
                break;

              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4['catch'](8);
                _didIteratorError = true;
                _iteratorError = _context4.t0;

              case 16:
                _context4.prev = 16;
                _context4.prev = 17;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 19:
                _context4.prev = 19;

                if (!_didIteratorError) {
                  _context4.next = 22;
                  break;
                }

                throw _iteratorError;

              case 22:
                return _context4.finish(19);

              case 23:
                return _context4.finish(16);

              case 24:
                _context4.next = 26;
                return Promise.all(settingPromises);

              case 26:
                return _context4.abrupt('return', settings.map(function (item) {
                  return dataloaders.settingsByKeys.load(item.settingKey);
                }));

              case 29:
                _context4.prev = 29;
                _context4.t1 = _context4['catch'](2);
                throw new _graphql.GraphQLError('error.data_invalid');

              case 32:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined, [[2, 29], [8, 12, 16, 24], [17,, 19, 23]]);
      }));

      return function resolve(_x7, _x8, _x9) {
        return _ref8.apply(this, arguments);
      };
    }()
  },
  removeSetting: {
    type: _graphql.GraphQLID,
    args: {
      settingKey: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) }
    },
    resolve: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(source, _ref12, _ref13) {
        var settingKey = _ref12.settingKey;
        var payload = _ref13.payload,
            dataloaders = _ref13.dataloaders;
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
                if (settingKey) {
                  _context5.next = 4;
                  break;
                }

                throw new _graphql.GraphQLError('Setting key cannot be null');

              case 4:
                _context5.next = 6;
                return (0, _database.promiseQuery)('UPDATE ' + _database.PREFIX + 'setting SET setting_value=\'\' WHERE setting_key=\'' + settingKey + '\'');

              case 6:
                dataloaders.settingsByKeys.clear(settingKey);

                return _context5.abrupt('return', dataloaders.settingsByKeys.load(settingKey));

              case 8:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined);
      }));

      return function resolve(_x10, _x11, _x12) {
        return _ref11.apply(this, arguments);
      };
    }()
  }
};