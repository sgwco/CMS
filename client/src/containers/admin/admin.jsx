import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';

import AdminComponent from '../../components/admin/admin';

export default compose(
  withRouter,
  lifecycle({
    componentWillMount() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.props.history.push('/admin/login');
      }
    }
  })
)(AdminComponent);