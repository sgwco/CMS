import { graphql } from 'react-apollo';
import { withProps, compose } from 'recompose';

import AdminSidebarComponent from '../../../components/admin/admin-sidebar/admin-sidebar';
import { GET_USER_TOKEN } from '../../../utils/graphql';

const data = [
  {
    header: 'MAIN NAVIGATION',
    menus: [
      {
        title: 'Dashboard',
        href: 'dashboard',
        icon: 'tachometer-alt'
      }
    ]
  },
  {
    header: 'MANAGEMENT',
    menus: [
      {
        title: 'Posts',
        href: 'post',
        icon: 'file',
        subMenu: [
          {
            title: 'All Posts',
            href: 'post'
          },
          {
            title: 'Post Categories',
            href: 'post/category',
          }
        ]
      },
      {
        title: 'Products',
        href: 'product',
        icon: 'shopping-cart',
        badgePrimary: '4'
      },
      {
        title: 'Package',
        href: 'package',
        icon: 'briefcase',
        readPermission: Math.pow(2, 13)
      },
      {
        title: 'Subscription',
        href: 'subscription',
        icon: 'cube',
        readPermission: Math.pow(2, 15)
      }
    ]
  },
  {
    header: 'CONFIGURATIONS',
    menus: [
      {
        title: 'Users',
        href: 'user',
        icon: 'user'
      },
      {
        title: 'Roles',
        href: 'role',
        icon: 'users'
      }
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