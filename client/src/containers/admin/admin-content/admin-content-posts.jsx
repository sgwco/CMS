import { compose, withProps } from 'recompose';

import AdminContentPostsComponent from '../../../components/admin/admin-content/admin-content-posts';

export default compose(
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Posts' }
    ]
  })),
)(AdminContentPostsComponent);