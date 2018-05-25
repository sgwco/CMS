import { compose, withProps, withHandlers, branch, renderNothing } from 'recompose';
import { graphql } from 'react-apollo';

import DashboardMember from '../../../../components/admin/admin-content/admin-content-dashboard/dashboard-member';
import { ACTIVE_PACKAGE, EDIT_PACKAGE, GET_USER_TOKEN, GET_SETTINGS } from '../../../../utils/graphql';
import { getKeyAsString, checkRoleIsAllowed } from '../../../../utils/utils';
import { PACKAGE_STATUS, ROLE_CAPABILITIES, SETTING_KEYS } from '../../../../utils/enum';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  graphql(GET_SETTINGS, { name: 'getSettings' }),
  branch(
    ({ getSettings: { settings }}) => !settings,
    renderNothing
  ),
  branch(
    ({getUserToken: { loggedInUser = {} }}) =>
      Object.keys(loggedInUser).length === 0 || checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.write_packages.value),
    renderNothing
  ),
  graphql(ACTIVE_PACKAGE, { name: 'listPackages' }),
  graphql(EDIT_PACKAGE, { name: 'editPackage' }),
  withProps(({ getSettings: { settings = [] }}) => ({
    language: (settings.find(item => item.settingKey === SETTING_KEYS.LANGUAGE) || {}).settingValue
  })),
  withProps(({ listPackages: { activePackage = [] } }) => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Dashboard' }
    ],
    listActivePackages: activePackage.filter(item => item.status !== 'EXPIRED' && item.status !== 'PENDING')
  })),
  withHandlers({
    onWithdrawPackage: ({ editPackage }) => async packageId => {
      const result = confirm('Do you want to withdraw this package?');
      if (result) {
        try {
          await editPackage({
            variables: {
              packageId,
              status: getKeyAsString(PACKAGE_STATUS.PENDING_EXPIRED, PACKAGE_STATUS)
            },
            update(cache, { data: { editPackage } }) {
              const { activePackage } = cache.readQuery({ query: ACTIVE_PACKAGE });
              const index = activePackage.findIndex(item => item.packageId === packageId);
              activePackage[index] = editPackage;
              cache.writeQuery({ query: ACTIVE_PACKAGE, data: { activePackage } });
            }
          });
        }
        catch (e) {
          // Code
        }
      }
    }
  })
)(DashboardMember);