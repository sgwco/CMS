import { compose, withProps, withState, withStateHandlers, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';

import { ALERT_STATUS } from '../../../commons/enum';
import AdminContentPostsFormComponent from '../../../components/admin/admin-content/admin-content-posts-form';

export default compose(
  withApollo,
  withRouter,
  withHandlers({
    renderTopTitle: ({ isEditedUser }) => () => isEditedUser ? 'Edit Post' : 'Add New Post',
  }),
  withProps(({ renderTopTitle }) => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { url: '/admin/post', icon: 'file', text: 'Posts' },
      { text: renderTopTitle() }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    null,
    {
      removeAlert: () => () => ({ alertVisible: ALERT_STATUS.HIDDEN }),
    }
  )
)(AdminContentPostsFormComponent);