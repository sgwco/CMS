import { compose, branch, withHandlers, withStateHandlers, withState, withProps } from 'recompose';
import { graphql, withApollo } from 'react-apollo';
import sha1 from 'sha1';

import AdminContentUsersFormComponent from '../../../components/admin/admin-content/admin-content-users-form';
import { GET_ROLES, CREATE_USER, GET_FULL_USERS } from '../../../utils/graphql';
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
    submitForm: ({ createUser, setAlertContent, setAlert }) => async (data) => {
      data.password = sha1(data.password);
      console.log(data);
      try {
        await createUser({
          variables: data,
          optimisticResponse: {
            __typename: 'Mutation',
            createUser: {
              __typename: 'User',
              id: Math.round(Math.random() * -1000000),
              username: data.username,
              fullname: data.fullname || '',
              email: data.email,
              registrationDate: data.registrationDate,
              role: {
                __typename: 'Role',
                id: data.role
              },
              userStatus: data.userStatus
            }
          },
          update(cache, { data: { createUser } }) {
            try {
              const { users } = cache.readQuery({ query: GET_FULL_USERS });
              console.log(users);
              users.push(createUser);
              cache.writeQuery({ query: GET_FULL_USERS, data: { users } });

            }
            catch (e) {
              // Nothing here
            }
          }
        });

        setAlertContent('Create user successfully');
        setAlert(ALERT_STATUS.SUCCESS);
      }
      catch(e) {
        setAlertContent('Error: ' + e.graphQLErrors[0].message);
        setAlert(ALERT_STATUS.ERROR);
      }
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