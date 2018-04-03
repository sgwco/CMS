export const USER_STATUS = {
  ACTIVE: 'active',
  DEACTIVE: 'deactive'
};

export const ALERT_STATUS = {
  HIDDEN: 0,
  ERROR: 1,
  SUCCESS: 2
};

export const roleCapabilities = {
  create_users: { title: 'Create users', value: Math.pow(2, 1) },
  edit_users: { title: 'Edit users', value: Math.pow(2, 2) },
  delete_users: { title: 'Delete users', value: Math.pow(2, 3) },
  list_users: { title: 'List users', value: Math.pow(2, 4) },
  promote_users: { title: 'Promote users', value: Math.pow(2, 5) },
  import: { title: 'Import', value: Math.pow(2, 6) },
  export: { title: 'Export', value: Math.pow(2, 7) },
  create_posts: { title: 'Create posts', value: Math.pow(2, 8) },
  edit_posts: { title: 'Edit posts', value: Math.pow(2, 9) },
  delete_posts: { title: 'Delete posts', value: Math.pow(2, 10) },
  list_posts: { title: 'List posts', value: Math.pow(2, 11) },
  create_products: { title: 'Create products', value: Math.pow(2, 12) },
  edit_products: { title: 'Edit products', value: Math.pow(2, 13) },
  delete_products: { title: 'Delete products', value: Math.pow(2, 14) },
  list_products: { title: 'List products', value: Math.pow(2, 15) },
  create_roles: { title: 'Create roles', value: Math.pow(2, 16) },
  edit_roles: { title: 'Edit roles', value: Math.pow(2, 17) },
  delete_roles: { title: 'Delete roles', value: Math.pow(2, 18) },
  list_roles: { title: 'List roles', value: Math.pow(2, 19) },
  create_taxonomies: { title: 'Create taxonomies', value: Math.pow(2, 20) },
  edit_taxonomies: { title: 'Edit taxonomies', value: Math.pow(2, 21) },
  delete_taxonomies: { title: 'Delete taxonomies', value: Math.pow(2, 22) },
  list_taxonomies: { title: 'List taxonomies', value: Math.pow(2, 23) },
  create_taxonomy_item: { title: 'Create taxonomy item', value: Math.pow(2, 24) },
  edit_taxonomy_item: { title: 'Edit taxonomy item', value: Math.pow(2, 25) },
  delete_taxonomy_item: { title: 'Delete taxonomy item', value: Math.pow(2, 26) },
  list_taxonomy_item: { title: 'List taxonomy item', value: Math.pow(2, 27) }
};