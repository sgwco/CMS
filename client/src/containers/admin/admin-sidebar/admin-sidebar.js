import { graphql } from 'react-apollo';
import { withProps, compose, renderNothing, branch } from 'recompose';

import AdminSidebarComponent from '../../../components/admin/admin-sidebar/admin-sidebar';
import { GET_USER_TOKEN, GET_SETTINGS } from '../../../utils/graphql';
import { ROLE_CAPABILITIES, SETTING_KEYS } from '../../../utils/enum';
import avatar from '../../../assets/img/user.png';
import lang from '../../../languages';

// const data = [
//   {
//     header: 'MAIN NAVIGATION',
    
//   }
//   {
//     header: 'MANAGEMENT',
//     showPermission: ROLE_CAPABILITIES.write_packages.value + ROLE_CAPABILITIES.read_user.value + ROLE_CAPABILITIES.read_roles.value,
//     menus: [
//       // { title: 'Posts', href: 'post', icon: 'file', readPermission: ROLE_CAPABILITIES.read_post.value, subMenu: [
//       //   { title: 'All Posts', href: 'post' },
//       //   { title: 'Post Categories', href: 'post/category' }
//       // ] },
//       // { title: 'Products', href: 'product', icon: 'shopping-cart', badgePrimary: '4', readPermission: ROLE_CAPABILITIES.read_products.value },
      
//     ]
//   }
// ];

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  graphql(GET_SETTINGS, { name: 'getSettings' }),
  branch(
    ({ getSettings: { settings }}) => !settings,
    renderNothing
  ),
  withProps(({ getSettings: { settings = [] }}) => ({
    language: (settings.find(item => item.settingKey === SETTING_KEYS.LANGUAGE) || {}).settingValue
  })),
  withProps(({ language }) => ({
    profile: {
      avatar
    },
    listMenus: [
      { title: lang('dashboard', language), href: 'dashboard', icon: 'tachometer-alt' },
      { separator: true },
      { title: lang('users', language), href: 'user', icon: 'user', readPermission: ROLE_CAPABILITIES.read_user.value },
      { title: lang('packages', language), href: 'package', icon: 'briefcase', readPermission: ROLE_CAPABILITIES.write_packages.value },
      { title: lang('roles', language), href: 'role', icon: 'users', readPermission: ROLE_CAPABILITIES.read_roles.value },
      { separator: true },
      { title: lang('settings', language), href: 'setting', icon: 'cog', readPermission: ROLE_CAPABILITIES.setting.value }
    ],
    
  }))
)(AdminSidebarComponent);