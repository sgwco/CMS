import { compose, branch, withHandlers, withStateHandlers, withState, withProps } from 'recompose';
import { graphql, withApollo } from 'react-apollo';
import sha1 from 'sha1';
import moment from 'moment';

import AdminContentUsersFormComponent from '../../../components/admin/admin-content/admin-content-users-form';
import { GET_ROLES, CREATE_USER, GET_FULL_USERS, EDIT_USER } from '../../../utils/graphql';
import { ALERT_STATUS, USER_STATUS } from '../../../commons/enum';

export default compose(
  withApollo,
  branch(
    ({ isEditedUser }) => !isEditedUser,
    graphql(CREATE_USER, { name: 'createUser' }),
    graphql(EDIT_USER, { name: 'editUser' })
  ),
  graphql(GET_ROLES(['id', 'name']), { name: 'getRoles' }),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withState('editUserChangePassword', 'setEditUserChangePassword', false),
  withStateHandlers(
    ({ additionalInformationVisible = false }) => ({ additionalInformationVisible }),
    {
      removeAlert: () => () => ({ alertVisible: ALERT_STATUS.HIDDEN }),
      toggleAdditionalForm: ({ additionalInformationVisible }) => () => ({ additionalInformationVisible: !additionalInformationVisible })
    }
  ),
  withHandlers({
    renderTopTitle: ({ isEditedUser }) => () => isEditedUser ? 'Edit User' : 'Add New User',
    submitForm: ({ createUser, setAlertContent, setAlert, isEditedUser, editUser, match }) => async (data) => {
      try {
        if (data.password) {
          data.password = sha1(data.password);
          delete data.retype_password;
        }

        if (isEditedUser) {
          data.id = match.params.id;
          await editUser({
            variables: data,
            optimisticResponse: {
              __typename: 'Mutation',
              editUser: {
                __typename: 'User',
                id: Math.round(Math.random() * -1000000),
                username: data.username,
                fullname: data.fullname || '',
                email: data.email,
                role: {
                  __typename: 'Role',
                  name: '-'
                },
                registrationDate: moment().format('YYYY-MM-DD HH:MM'),
                userStatus: USER_STATUS.ACTIVE
              }
            },
            update(cache, { data: { editUser } }) {
              try {
                const { users } = cache.readQuery({ query: GET_FULL_USERS });
                const index = users.findIndex(item => item.id === match.params.id);
                users[index] = editUser;
                cache.writeQuery({ query: GET_FULL_USERS, data: { users } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });
          setAlertContent('Create user successfully!');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        else {
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
                role: {
                  __typename: 'Role',
                  name: '-'
                },
                registrationDate: moment().format('YYYY-MM-DD HH:MM'),
                userStatus: USER_STATUS.ACTIVE
              }
            },
            update(cache, { data: { createUser } }) {
              try {
                const { users } = cache.readQuery({ query: GET_FULL_USERS });
                users.push(createUser);
                cache.writeQuery({ query: GET_FULL_USERS, data: { users } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });
          setAlertContent('Edit user successfully!');
          setAlert(ALERT_STATUS.SUCCESS);
        }
      }
      catch (e) {
        setAlertContent('Error: ' + e.graphQLErrors[0].message);
        setAlert(ALERT_STATUS.ERROR);
      }
    },
    initValue: ({ isEditedUser, client, history, match }) => (formApi) => {
      if (isEditedUser) {
        try {
          const { users } = client.cache.readQuery({ query: GET_FULL_USERS });
          const user = users.find(item => item.id === match.params.id);

          formApi.setValue('username', user.username);
          formApi.setValue('email', user.email);
          formApi.setValue('role', user.role.id);
          formApi.setValue('fullname', user.fullname);
          formApi.setValue('address', user.address);
          formApi.setValue('phone', user.phone);
        }
        catch (e) {
          history.push('/admin/user');
        }
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