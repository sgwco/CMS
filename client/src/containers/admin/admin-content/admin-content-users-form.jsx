import { compose, branch, withHandlers, withStateHandlers, withState, withProps } from 'recompose';
import { graphql, withApollo } from 'react-apollo';
import sha1 from 'sha1';

import AdminContentUsersFormComponent from '../../../components/admin/admin-content/admin-content-users-form';
import { GET_ROLES, CREATE_USER } from '../../../utils/graphql';
import { ALERT_STATUS } from '../../../commons/enum';

export default compose(
  withApollo,
  branch(
    ({ isEditedUser }) => !isEditedUser,
    graphql(CREATE_USER, { name: 'createUser' })
  ),
  graphql(GET_ROLES(['id', 'name']), { name: 'getRoles' }),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    ({ additionalInformationVisible = false }) => ({ additionalInformationVisible }),
    {
      removeAlert: () => () => ({ alertVisible: ALERT_STATUS.HIDDEN }),
      toggleAdditionalForm: ({ additionalInformationVisible }) => () => ({ additionalInformationVisible: !additionalInformationVisible })
    }
  ),
  withHandlers({
    renderTopTitle: ({ isEditedUser }) => () => isEditedUser ? 'Edit User' : 'Add New User',
    submitForm: ({ createUser }) => (data) => {
      data.password = sha1(data.password);
      createUser({
        variables: data
      });
    }
  }),
  withProps(({ renderTopTitle }) => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { url: '/admin/user', icon: 'user', text: 'Users' },
      { text: renderTopTitle() }
    ]
  }))
)(AdminContentUsersFormComponent);