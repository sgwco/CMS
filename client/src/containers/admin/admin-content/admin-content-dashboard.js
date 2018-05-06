import { compose, withProps } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentDashboardComponent from '../../../components/admin/admin-content/admin-content-dashboard';
import { GET_USER_TOKEN } from '../../../utils/graphql';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Dashboard' }
    ]
  })),
)(AdminContentDashboardComponent);