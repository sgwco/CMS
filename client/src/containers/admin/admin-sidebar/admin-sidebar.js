import { graphql } from 'react-apollo';
import { withProps, compose } from 'recompose';

import AdminSidebarComponent from '../../../components/admin/admin-sidebar/admin-sidebar';
import { GET_USER_TOKEN } from '../../../utils/graphql';
import { ROLE_CAPABILITIES } from '../../../utils/enum';

const data = [
  {
    header: 'COMMON',
    menus: [
      { title: 'Dashboard', href: 'dashboard', icon: 'tachometer-alt' }
    ]
  },
  {
    header: 'MANAGEMENT',
    showPermission: ROLE_CAPABILITIES.write_packages.value + ROLE_CAPABILITIES.read_user.value + ROLE_CAPABILITIES.read_roles.value,
    menus: [
      // { title: 'Posts', href: 'post', icon: 'file', readPermission: ROLE_CAPABILITIES.read_post.value, subMenu: [
      //   { title: 'All Posts', href: 'post' },
      //   { title: 'Post Categories', href: 'post/category' }
      // ] },
      // { title: 'Products', href: 'product', icon: 'shopping-cart', badgePrimary: '4', readPermission: ROLE_CAPABILITIES.read_products.value },
      { title: 'Package', href: 'package', icon: 'briefcase', readPermission: ROLE_CAPABILITIES.write_packages.value },
      { title: 'Users', href: 'user', icon: 'user', readPermission: ROLE_CAPABILITIES.read_user.value },
      { title: 'Roles', href: 'role', icon: 'users', readPermission: ROLE_CAPABILITIES.read_roles.value }
    ]
  }
];

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  withProps(() => ({
    profile: {
      avatar: 'https://graph.facebook.com/100006945288953/picture?type=square'
    },
    menuData: data
  }))
)(AdminSidebarComponent);