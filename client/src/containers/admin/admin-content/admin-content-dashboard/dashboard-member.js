import { compose, withProps, withHandlers, branch, renderNothing, withState } from 'recompose';
import { graphql } from 'react-apollo';

import DashboardMember from '../../../../components/admin/admin-content/admin-content-dashboard/dashboard-member';
import { ACTIVE_PACKAGE, EDIT_PACKAGE, GET_USER_TOKEN } from '../../../../utils/graphql';
import { getKeyAsString, checkRoleIsAllowed } from '../../../../utils/utils';
import { PACKAGE_STATUS, ROLE_CAPABILITIES } from '../../../../utils/enum';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  branch(
    ({getUserToken: { loggedInUser = {} }}) =>
      Object.keys(loggedInUser).length === 0 || checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.write_packages.value),
    renderNothing
  ),
  graphql(ACTIVE_PACKAGE, { name: 'listPackages' }),
  graphql(EDIT_PACKAGE, { name: 'editPackage' }),
  withProps(({ listPackages: { activePackage = [] } }) => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Dashboard' }
    ],
    listActivePackages: activePackage.filter(item => item.status !== 'EXPIRED')
  })),
  withState('selectedPackageIndex', 'selectPackageAction', -1),
  withHandlers({
    onUpgradePackage: ({ editPackage }) => async id => {
      const result = confirm('Do you want to withdraw this package?');
      if (result) {
        try {
          await editPackage({
            variables: {
              id,
              status: getKeyAsString(PACKAGE_STATUS.PENDING_EXPIRED, PACKAGE_STATUS)
            },
            update(cache, { data: { activePackage } }) {
              cache.writeQuery({ query: ACTIVE_PACKAGE, data: { activePackage } });
            }
          });
        }
        catch (e) {
          // Code
        }
      }
    },
    selectPackageAction: ({ selectPackageAction, listActivePackages }) => e => {
      selectPackageAction(listActivePackages.findIndex(item => item.id === e.target.value));
    }
  })
)(DashboardMember);