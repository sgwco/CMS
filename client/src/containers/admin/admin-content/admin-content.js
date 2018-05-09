import { compose } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentComponent from '../../../components/admin/admin-content/admin-content';
import { GET_USER_TOKEN } from '../../../utils/graphql';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
)(AdminContentComponent);