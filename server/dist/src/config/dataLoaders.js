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

exports.default = {
  rolesByIds: new _dataloader2.default(getRolesByIds)
};