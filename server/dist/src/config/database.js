'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDatabase = exports.connection = exports.PREFIX = undefined;

var initData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var adminRole;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return promiseQuery('INSERT IGNORE INTO ' + PREFIX + 'role (name, access_permission) VALUES (\n    \'Admin\',\n    ' + Object.keys(_enum.ROLE_CAPABILITIES).map(function (item) {
              return _enum.ROLE_CAPABILITIES[item].value;
            }).reduce(function (total, item) {
              return total + item;
            }, 0) + '\n  )');

          case 2:
            _context.next = 4;
            return promiseQuery('SELECT id FROM ' + PREFIX + 'role WHERE name=\'Admin\'');

          case 4:
            adminRole = _context.sent;

            if (adminRole.length > 0) {
              // Root user
              promiseQuery('INSERT IGNORE INTO ' + PREFIX + 'user (username, password, registration_date, role, user_status)\n    VALUES (\n      \'admin\',\n      \'' + (0, _sha2.default)('123456') + '\',\n      \'' + (0, _moment2.default)().format('YYYY-MM-DD') + '\',\n      \'' + adminRole[0].id + '\',\n      \'active\'\n    )');
            }

            promiseQuery('INSERT IGNORE INTO ' + PREFIX + 'setting (setting_key, setting_value) VALUES (\'language\', \'vi\'), (\'company_name\', \'Sai Gon Web\')');

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function initData() {
    return _ref.apply(this, arguments);
  };
}();

var initDatabase = exports.initDatabase = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(conn) {
    var _this = this;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return promiseQuery('CREATE DATABASE IF NOT EXISTS ' + DATABASE);

          case 2:
            conn.changeUser({
              database: DATABASE
            }, function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(err) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'role (\n      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,\n      name VARCHAR(200) NOT NULL UNIQUE,\n      access_permission BIGINT UNSIGNED NOT NULL\n    )');

                      case 2:
                        _context2.next = 4;
                        return promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'user (\n      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,\n      username VARCHAR(50) NOT NULL UNIQUE,\n      password VARCHAR(50) NOT NULL,\n      fullname VARCHAR(100),\n      email VARCHAR(200) UNIQUE,\n      registration_date DATETIME NOT NULL,\n      role INT UNSIGNED NOT NULL,\n      address VARCHAR(200),\n      phone VARCHAR(50),\n      user_status VARCHAR(20) NOT NULL DEFAULT \'active\',\n      CONSTRAINT FK_ROLE FOREIGN KEY (role) REFERENCES ' + PREFIX + 'role(id) ON DELETE CASCADE ON UPDATE CASCADE\n    )');

                      case 4:

                        promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'user_meta (\n      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,\n      user_id INT UNSIGNED NOT NULL,\n      meta_key VARCHAR(50) NOT NULL,\n      meta_value VARCHAR(200) NOT NULL,\n      CONSTRAINT FK_USER FOREIGN KEY (user_id) REFERENCES ' + PREFIX + 'user(id) ON DELETE CASCADE ON UPDATE CASCADE\n    )');

                        // Package table
                        _context2.next = 7;
                        return promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'package (\n      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,\n      user_id INT UNSIGNED NOT NULL,\n      price BIGINT UNSIGNED NOT NULL,\n      currency VARCHAR(10) NOT NULL,\n      duration INT(10) UNSIGNED NOT NULL,\n      register_date DATE NOT NULL,\n      status VARCHAR(50) NOT NULL,\n      CONSTRAINT FK_PACKAGE FOREIGN KEY (user_id) REFERENCES ' + PREFIX + 'user(id) ON DELETE CASCADE ON UPDATE CASCADE\n    )');

                      case 7:

                        promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'package_progress (\n      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,\n      package_id INT UNSIGNED NOT NULL,\n      amount FLOAT(10, 2) UNSIGNED NOT NULL,\n      interest_rate INT UNSIGNED NOT NULL,\n      date DATE NOT NULL,\n      status BOOLEAN NOT NULL,\n      withdraw_date DATE,\n      CONSTRAINT FK_PACKAGE_PROGRESS FOREIGN KEY (package_id) REFERENCES ' + PREFIX + 'package(id) ON DELETE CASCADE ON UPDATE CASCADE\n    )');

                        _context2.next = 10;
                        return promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'setting (\n      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,\n      setting_key VARCHAR(100) NOT NULL UNIQUE,\n      setting_value VARCHAR(200) NOT NULL\n    )');

                      case 10:

                        initData();

                      case 11:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function initDatabase(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.promiseQuery = promiseQuery;

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _sha = require('sha1');

var _sha2 = _interopRequireDefault(_sha);

var _enum = require('../enum');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require(process.env.NODE_ENV === 'production' ? '../../../config.json' : '../../config.json'),
    HOSTING = _require.HOSTING,
    USER = _require.USER,
    PASSWORD = _require.PASSWORD,
    DATABASE = _require.DATABASE;

var PREFIX = exports.PREFIX = 'sgw_';

var connection = exports.connection = _mysql2.default.createConnection({
  host: HOSTING,
  user: USER,
  password: PASSWORD
});

function promiseQuery(query) {
  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, results) {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}