'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mutation = exports.Query = undefined;

var _graphql = require('graphql');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Query = exports.Query = {
  medias: {
    type: new _graphql.GraphQLList(_models.Media),
    resolve: function resolve() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var rows;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return promiseQuery('SELECT * FROM ' + PREFIX + 'media');

              case 2:
                rows = _context.sent;
                return _context.abrupt('return', rows);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }))();
    }
  },
  role: {
    type: _models.Media,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) }
    },
    resolve: function resolve(source, _ref) {
      var _this2 = this;

      var id = _ref.id;
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var rows;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return promiseQuery('SELECT * FROM ' + PREFIX + 'media WHERE id=\'' + id + '\'');

              case 2:
                rows = _context2.sent;

                if (!(rows.length > 0)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt('return', rows[0]);

              case 7:
                throw new GraphQLError('Media does not exist');

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }))();
    }
  }
};

var Mutation = exports.Mutation = {
  uploadMedia: {
    type: _models.Media,
    args: {
      file: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) },
      uploadBy: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) }
    },
    resolve: function resolve(source, args) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var lastId;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (args.file) {
                  _context3.next = 2;
                  break;
                }

                throw new GraphQLError('File cannot be null');

              case 2:
                if (args.uploadBy) {
                  _context3.next = 4;
                  break;
                }

                throw new GraphQLError('Upload user cannot be null');

              case 4:
                _context3.next = 6;
                return promiseQuery('INSERT INTO ' + PREFIX + 'role VALUES (\n        NULL,\n        \'' + args.name + '\',\n        \'' + args.accessPermission + '\'\n      )');

              case 6:
                _context3.next = 8;
                return promiseQuery('SELECT LAST_INSERT_ID()');

              case 8:
                lastId = _context3.sent;

                if (!(lastId.length > 0)) {
                  _context3.next = 13;
                  break;
                }

                return _context3.abrupt('return', {
                  id: lastId[0]['LAST_INSERT_ID()'],
                  name: args.name,
                  access_permission: args.accessPermission
                });

              case 13:
                throw new GraphQLError('error.cannot_insert');

              case 14:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this3);
      }))();
    }
  },
  removeMedia: {
    type: _graphql.GraphQLID,
    args: {
      id: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID) }
    },
    resolve: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(source, args) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (args.id) {
                  _context4.next = 2;
                  break;
                }

                throw new GraphQLError('Id cannot be null');

              case 2:

                promiseQuery('DELETE FROM ' + PREFIX + 'role WHERE id=\'' + args.id + '\'');
                return _context4.abrupt('return', args.id);

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined);
      }));

      return function resolve(_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }()
  }
};