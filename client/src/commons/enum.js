export const USER_STATUS = {
  ACTIVE: 'active',
  DEACTIVE: 'deactive'
};

export const ALERT_STATUS = {
  HIDDEN: '',
  ERROR: 'error',
  SUCCESS: 'success'
};

export const roleCapabilities = {
  create_users: { title: 'Create users', value: Math.pow(2, 0) },
  edit_users: { title: 'Edit users', value: Math.pow(2, 1) },
  delete_users: { title: 'Delete users', value: Math.pow(2, 2) },
  list_users: { title: 'List users', value: Math.pow(2, 3) },
  promote_users: { title: 'Promote users', value: Math.pow(2, 4) },
  import: { title: 'Import', value: Math.pow(2, 5) },
  export: { title: 'Export', value: Math.pow(2, 6) },
  create_posts: { title: 'Create posts', value: Math.pow(2, 7) },
  edit_posts: { title: 'Edit posts', value: Math.pow(2, 8) },
  delete_posts: { title: 'Delete posts', value: Math.pow(2, 9) },
  list_posts: { title: 'List posts', value: Math.pow(2, 10) },
  create_products: { title: 'Create products', value: Math.pow(2, 11) },
  edit_products: { title: 'Edit products', value: Math.pow(2, 12) },
  delete_products: { title: 'Delete products', value: Math.pow(2, 13) },
  list_products: { title: 'List products', value: Math.pow(2, 14) },
  create_roles: { title: 'Create roles', value: Math.pow(2, 15) },
  edit_roles: { title: 'Edit roles', value: Math.pow(2, 16) },
  delete_roles: { title: 'Delete roles', value: Math.pow(2, 17) },
  list_roles: { title: 'List roles', value: Math.pow(2, 18) },
  create_taxonomies: { title: 'Create taxonomies', value: Math.pow(2, 19) },
  edit_taxonomies: { title: 'Edit taxonomies', value: Math.pow(2, 20) },
  delete_taxonomies: { title: 'Delete taxonomies', value: Math.pow(2, 21) },
  list_taxonomies: { title: 'List taxonomies', value: Math.pow(2, 22) },
  create_taxonomy_item: { title: 'Create taxonomy item', value: Math.pow(2, 23) },
  edit_taxonomy_item: { title: 'Edit taxonomy item', value: Math.pow(2, 24) },
  delete_taxonomy_item: { title: 'Delete taxonomy item', value: Math.pow(2, 25) },
  list_taxonomy_item: { title: 'List taxonomy item', value: Math.pow(2, 26) }
};