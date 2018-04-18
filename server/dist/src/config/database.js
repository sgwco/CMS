'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDatabase = exports.connection = exports.PREFIX = undefined;

var initDatabase = exports.initDatabase = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(conn) {
    var _this = this;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return promiseQuery('CREATE DATABASE IF NOT EXISTS ' + DATABASE);

          case 2:
            conn.changeUser({
              database: DATABASE
            }, function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'role (\n      id VARCHAR(50) NOT NULL PRIMARY KEY,\n      name VARCHAR(200) NOT NULL,\n      access_permission BIGINT UNSIGNED NOT NULL\n    )');

                      case 2:

                        // Post table
                        promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'post (\n      id VARCHAR(50) NOT NULL PRIMARY KEY,\n      title VARCHAR(1000) NOT NULL,\n      content LONGTEXT NOT NULL,\n      excerpt LONGTEXT NOT NULL,\n      author VARCHAR(50) NOT NULL,\n      slug VARCHAR(1000) NOT NULL UNIQUE,\n      category VARCHAR(8000) NOT NULL,\n      thumbnail VARCHAR(50),\n      count INT(10) UNSIGNED DEFAULT 0,\n      publish_date DATETIME NOT NULL\n    )');

                        // Category table
                        promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'category (\n      id VARCHAR(50) NOT NULL PRIMARY KEY,\n      name VARCHAR(1000) NOT NULL,\n      slug VARCHAR(1000) NOT NULL UNIQUE,\n      parent VARCHAR(50),\n      description LONGTEXT NOT NULL,\n      thumbnail VARCHAR(50) NOT NULL\n    )');

                        // Media table
                        promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'media (\n      id VARCHAR(50) NOT NULL PRIMARY KEY,\n      name VARCHAR(1000) NOT NULL,\n      url VARCHAR(2000) NOT NULL,\n      type VARCHAR(50) NOT NULL,\n      upload_date DATETIME NOT NULL,\n      upload_by VARCHAR(50) NOT NULL\n    )');

                        // Media Meta table
                        promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'media_meta (\n      id VARCHAR(50) NOT NULL PRIMARY KEY,\n      name VARCHAR(1000) NOT NULL,\n      value VARCHAR(2000)\n    )');

                        // User table
                        promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'user (\n      id VARCHAR(50) NOT NULL PRIMARY KEY,\n      username VARCHAR(50) NOT NULL UNIQUE,\n      password VARCHAR(50) NOT NULL,\n      fullname VARCHAR(100) NOT NULL,\n      email VARCHAR(200) NOT NULL UNIQUE,\n      registration_date DATETIME NOT NULL,\n      role VARCHAR(50) NOT NULL,\n      address VARCHAR(200) DEFAULT \'\',\n      phone VARCHAR(50) DEFAULT \'\',\n      user_status VARCHAR(20) NOT NULL DEFAULT \'active\',\n      CONSTRAINT FK_ROLE FOREIGN KEY (role) REFERENCES ' + PREFIX + 'role(id) ON DELETE CASCADE ON UPDATE CASCADE\n    )');

                        // Package table
                        _context.next = 9;
                        return promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'package (\n      id VARCHAR(50) NOT NULL PRIMARY KEY,\n      name VARCHAR(100) NOT NULL,\n      price INT(10) UNSIGNED NOT NULL,\n      interest_rate FLOAT(10, 5) UNSIGNED NOT NULL\n    )');

                      case 9:

                        // Subscription table
                        promiseQuery('CREATE TABLE IF NOT EXISTS ' + PREFIX + 'subscription (\n      id VARCHAR(50) NOT NULL PRIMARY KEY,\n      user_id VARCHAR(50) NOT NULL,\n      package_id VARCHAR(50) NOT NULL,\n      duration INT(10) NOT NULL,\n      subscribe_date DATETIME NOT NULL,\n      status VARCHAR(50) NOT NULL,\n      CONSTRAINT FK_USER FOREIGN KEY (user_id) REFERENCES ' + PREFIX + 'user(id) ON DELETE CASCADE ON UPDATE CASCADE,\n      CONSTRAINT FK_PACKAGE FOREIGN KEY (package_id) REFERENCES ' + PREFIX + 'package(id) ON DELETE CASCADE ON UPDATE CASCADE\n    )');

                      case 10:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function initDatabase(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.promiseQuery = promiseQuery;

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var HOSTING = '127.0.0.1';
var USER = 'root';
var PASSWORD = 'password';
var DATABASE = 'sgw_cms';
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