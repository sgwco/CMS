import { compose, withProps, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';

import DashboardMember from '../../../../components/admin/admin-content/admin-content-dashboard/dashboard-member';
import { ACTIVE_PACKAGE, EDIT_PACKAGE } from '../../../../utils/graphql';
import { getKeyAsString } from '../../../../utils/utils';
import { PACKAGE_STATUS } from '../../../../utils/enum';

export default compose(
  graphql(ACTIVE_PACKAGE, { name: 'activePackage' }),
  graphql(EDIT_PACKAGE, { name: 'editPackage' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Dashboard' }
    ]
  })),
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
  })
)(DashboardMember);