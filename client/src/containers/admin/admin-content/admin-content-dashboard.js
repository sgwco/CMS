import { compose, withProps } from 'recompose';

import AdminContentDashboardComponent from '../../../components/admin/admin-content/admin-content-dashboard';

export default compose(
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin/dashboard', icon: 'home', text: 'categories.home' },
      { text: 'categories.dashboard' }
    ]
  }))
)(AdminContentDashboardComponent);