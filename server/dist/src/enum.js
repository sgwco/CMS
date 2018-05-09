'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var USER_STATUS = exports.USER_STATUS = {
  ACTIVE: 'active',
  BANNED: 'banned',
  PENDING: 'pending'
};

var PACKAGE_DURATION = exports.PACKAGE_DURATION = {
  MONTH_6: 6,
  MONTH_12: 12
};

var CURRENCY = exports.CURRENCY = {
  VND: 'VND',
  USD: 'USD'
};

var PACKAGE_STATUS = exports.PACKAGE_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  PENDING_EXPIRED: 'pending_expired',
  EXPIRED: 'expired'
};

var ROLE_CAPABILITIES = exports.ROLE_CAPABILITIES = {
  read_user: { title: 'Read users', value: Math.pow(2, 0) },
  write_user: { title: 'Write users', value: Math.pow(2, 1) },
  promote_users: { title: 'Promote users', value: Math.pow(2, 2) },
  read_post: { title: 'Read posts', value: Math.pow(2, 3) },
  write_post: { title: 'Write posts', value: Math.pow(2, 4) },
  read_products: { title: 'Read products', value: Math.pow(2, 5) },
  write_products: { title: 'Write products', value: Math.pow(2, 6) },
  read_roles: { title: 'Read roles', value: Math.pow(2, 7) },
  write_roles: { title: 'Write roles', value: Math.pow(2, 8) },
  read_taxonomies: { title: 'Read taxonomies', value: Math.pow(2, 9) },
  write_taxonomies: { title: 'Write taxonomies', value: Math.pow(2, 10) },
  read_taxonomy_items: { title: 'Read taxonomy items', value: Math.pow(2, 11) },
  write_taxonomy_items: { title: 'Write taxonomy items', value: Math.pow(2, 12) },
  read_packages: { title: 'Read packages', value: Math.pow(2, 13) },
  write_packages: { title: 'Write packages', value: Math.pow(2, 14) },
  import: { title: 'Import', value: Math.pow(2, 15) },
  export: { title: 'Export', value: Math.pow(2, 16) }
};