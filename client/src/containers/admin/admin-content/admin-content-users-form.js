import { compose, branch, withHandlers, withStateHandlers, withState, withProps, renderNothing } from 'recompose';
import { graphql, withApollo } from 'react-apollo';
import sha1 from 'sha1';
import moment from 'moment';
import _ from 'lodash';

import AdminContentUsersFormComponent from '../../../components/admin/admin-content/admin-content-users-form';
import { GET_ROLES, CREATE_USER, GET_FULL_USERS, EDIT_USER, GET_USER_TOKEN } from '../../../utils/graphql';
import { ALERT_STATUS, USER_STATUS, ROLE_CAPABILITIES } from '../../../utils/enum';
import { checkRoleIsAllowed } from '../../../utils/utils';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  branch(
    ({getUserToken: { loggedInUser = {} }}) =>
      _.isEmpty(loggedInUser) || !checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.write_user.value),
    renderNothing
  ),
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
      toggleAdditionalForm: ({ additionalInformationVisible }) => () => ({ additionalInformationVisible: !additionalInformationVisible })
    }
  ),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    renderTopTitle: ({ isEditedUser }) => () => isEditedUser ? 'edit_user.edit' : 'edit_user.add_new',
    submitForm: ({ createUser, setAlertContent, setAlert, isEditedUser, editUser, match }) => async (data) => {
      try {
        if (data.password) {
          data.password = sha1(data.password);
          delete data.retype_password;
        }

        const userMetaKey = ['identityCard', 'banking', 'bankingNumber', 'bankingOwner'];
        const userMeta = userMetaKey.map(item => ({
          metaKey: item,
          metaValue: data[item] || ''
        }));
        if (userMeta.length > 0) {
          data.userMeta = JSON.stringify(userMeta);
          for (const key of userMetaKey) {
            delete data[key];
          }
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
          setAlertContent('Edit user successfully!');
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
          setAlertContent('Create user successfully!');
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
          formApi.setValue('address', user.address);
          formApi.setValue('identityCard', (user.userMeta.find(item => item.metaKey === 'identityCard') || {}).metaValue);
          formApi.setValue('banking', (user.userMeta.find(item => item.metaKey === 'banking') || {}).metaValue);
          formApi.setValue('bankingNumber', (user.userMeta.find(item => item.metaKey === 'bankingNumber') || {}).metaValue);
          formApi.setValue('bankingOwner', (user.userMeta.find(item => item.metaKey === 'bankingOwner') || {}).metaValue);
        }
        catch (e) {
          history.push('/admin/user');
        }
      }
    }
  }),
  withProps(({ renderTopTitle }) => ({
    breadcrumbItems: [
      { url: '/admin/dashboard', icon: 'home', text: 'categories.home' },
      { url: '/admin/user', icon: 'user', text: 'categories.users' },
      { text: renderTopTitle() }
    ]
  }))
)(AdminContentUsersFormComponent);