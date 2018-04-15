import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import AdminTopbarComponent from '../../components/admin/admin-topbar';
import { GET_USER_TOKEN } from '../../utils/graphql';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' })
)(AdminTopbarComponent);