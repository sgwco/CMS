import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose, withHandlers } from 'recompose';

import AdminTopbarComponent from '../../components/admin/admin-topbar';
import { GET_USER_TOKEN, GET_SETTINGS } from '../../utils/graphql';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  graphql(GET_SETTINGS, { name: 'getSettings' }),
  withRouter,
  withHandlers({
    logout: ({ history }) => () => {
      localStorage.removeItem('token');
      history.push('/admin/login');
    }
  })
)(AdminTopbarComponent);