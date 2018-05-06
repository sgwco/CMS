import { compose, withProps } from 'recompose';

import AdminContentDashboardComponent from '../../../components/admin/admin-content/admin-content-dashboard';

export default compose(
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Dashboard' }
    ]
  })),
)(AdminContentDashboardComponent);