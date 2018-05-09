import { compose, lifecycle, withStateHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';

import AdminComponent from '../../components/admin/admin';

export default compose(
  withRouter,
  withStateHandlers(
    ({ collapseSidebar = false }) => ({ collapseSidebar }),
    {
      toggleSidebar: ({ collapseSidebar }) => () => ({ collapseSidebar: !collapseSidebar })
    }
  ),
  lifecycle({
    componentWillMount() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.props.history.push('/admin/login');
      }
    }
  })
)(AdminComponent);