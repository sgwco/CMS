'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _database = require('./database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getRolesByIds = function getRolesByIds(roleIds) {
  var params = roleIds.map(function (id) {
    return '\'' + id + '\'';
  }).join(', ');
  return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'role WHERE id IN (' + params + ')');
};

var getUsersByIds = function getUsersByIds(userIds) {
  var params = userIds.map(function (id) {
    return '\'' + id + '\'';
  }).join(', ');
  return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'user WHERE id IN (' + params + ')');
};

var getPostsByIds = function getPostsByIds(postIds) {
  var params = postIds.map(function (id) {
    return '\'' + id + '\'';
  }).join(', ');
  return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'post WHERE id IN (' + params + ')');
};

var getCategoriesByIds = function getCategoriesByIds(categoryIds) {
  var params = categoryIds.map(function (id) {
    return '\'' + id + '\'';
  }).join(', ');
  return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'category WHERE id IN (' + params + ')');
};

var getPackagesByIds = function getPackagesByIds(packageIds) {
  var params = packageIds.map(function (id) {
    return '\'' + id + '\'';
  }).join(', ');
  return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'package WHERE id IN (' + params + ')');
};

var getPackageProgressesByIds = function getPackageProgressesByIds(packageProgressIds) {
  var params = packageProgressIds.map(function (id) {
    return '\'' + id + '\'';
  }).join(', ');
  return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'package_progress WHERE id IN (' + params + ')');
};

var getSettingsByKeys = function getSettingsByKeys(settingKeys) {
  var params = settingKeys.map(function (key) {
    return '\'' + key + '\'';
  }).join(', ');
  return (0, _database.promiseQuery)('SELECT * FROM ' + _database.PREFIX + 'setting WHERE setting_key IN (' + params + ')');
};

exports.default = {
  rolesByIds: new _dataloader2.default(getRolesByIds),
  usersByIds: new _dataloader2.default(getUsersByIds),
  postsByIds: new _dataloader2.default(getPostsByIds),
  categoriesByIds: new _dataloader2.default(getCategoriesByIds),
  packagesByIds: new _dataloader2.default(getPackagesByIds),
  packageProgressesByIds: new _dataloader2.default(getPackageProgressesByIds),
  settingsByKeys: new _dataloader2.default(getSettingsByKeys)
};