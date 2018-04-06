import React from 'react';
import { withStateHandlers, compose } from 'recompose';

import AdminSidebarComponent from '../../../components/admin/admin-sidebar/admin-sidebar';

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
        icon: 'file'
      },
      {
        title: 'Products',
        href: 'product',
        icon: 'shopping-cart',
        badgePrimary: '4'
      },
      {
        title: 'Users',
        href: 'user',
        icon: 'user'
      }
    ]
  },
  {
    header: 'CONFIGURATIONS',
    menus: [
      {
        title: 'Roles',
        href: 'role',
        icon: 'users'
      }
    ]
  }
];

const AdminSidebarContainer = ({ selectedMenu, setSelectedMenu }) => (
  <AdminSidebarComponent
    profile={{ fullname: 'Vo Hoai Son', role: 'Admin', avatar: 'https://graph.facebook.com/100006945288953/picture?type=square' }}
    menuData={data}
    selectedMenu={selectedMenu}
    onSelectMenu={setSelectedMenu}
  />
);

export default compose(
  withStateHandlers(
    ({ initialSelectedMenu = 'dashboard' }) => ({ selectedMenu: initialSelectedMenu }),
    {
      setSelectedMenu: () => (currentMenu) => ({ selectedMenu: currentMenu })
    }
  )
)(AdminSidebarContainer);