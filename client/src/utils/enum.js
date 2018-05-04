export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  DEACTIVE: 'DEACTIVE'
};

export const ALERT_STATUS = {
  HIDDEN: '',
  ERROR: 'error',
  SUCCESS: 'success'
};

export const CURRENCY = {
  VND: 'VND',
  USD: 'USD'
};

export const DURATION_TYPE = {
  MONTH_6: 6,
  MONTH_12: 12
};

export const PACKAGE_STATUS = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
  EXPIRED: 'Expired'
};

export const roleCapabilities = {
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
  read_packages: { title: 'Read roles', value: Math.pow(2, 13) },
  write_packages: { title: 'Write roles', value: Math.pow(2, 14) },
  import: { title: 'Import', value: Math.pow(2, 15) },
  export: { title: 'Export', value: Math.pow(2, 16) },
};