'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createToken = undefined;

var createToken = exports.createToken = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(payload) {
    var obj;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            obj = Object.assign({}, payload);
            return _context.abrupt('return', _jsonwebtoken2.default.sign(obj, SECRET));

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createToken(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.verifyToken = verifyToken;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _database = require('./database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var SECRET = '@saigonweb';

function verifyToken(token) {
  if (!token) return null;

  try {
    var decoded = _jsonwebtoken2.default.verify(token, SECRET);
    return decoded;
  } catch (e) {
    return null;
  }
}