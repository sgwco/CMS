import { graphql } from 'react-apollo';
import { withProps, compose } from 'recompose';

import AdminSidebarComponent from '../../../components/admin/admin-sidebar/admin-sidebar';
import { GET_USER_TOKEN } from '../../../utils/graphql';
import { roleCapabilities } from '../../../commons/enum';

const data = [
  {
    header: 'COMMON',
    menus: [
      { title: 'Dashboard', href: 'dashboard', icon: 'tachometer-alt' }
    ]
  },
  {
    header: 'MANAGEMENT',
    menus: [
      { title: 'Posts', href: 'post', icon: 'file', readPermission: roleCapabilities.read_post.value, subMenu: [
        { title: 'All Posts', href: 'post' },
        { title: 'Post Categories', href: 'post/category' }
      ] },
      { title: 'Products', href: 'product', icon: 'shopping-cart', badgePrimary: '4', readPermission: roleCapabilities.read_products.value },
      { title: 'Package', href: 'package', icon: 'briefcase', readPermission: roleCapabilities.read_packages.value },
      { title: 'Users', href: 'user', icon: 'user', readPermission: roleCapabilities.read_user.value },
      { title: 'Roles', href: 'role', icon: 'users', readPermission: roleCapabilities.read_roles.value }
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