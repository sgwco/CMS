import { compose, withHandlers, withState, withStateHandlers, withProps, branch, renderNothing } from 'recompose';
import { graphql } from 'react-apollo';
import _ from 'lodash';

import AdminContentUsersComponent from '../../../components/admin/admin-content/admin-content-users';
import { ALERT_STATUS, ROLE_CAPABILITIES } from '../../../utils/enum';
import { GET_FULL_USERS, REMOVE_USER, GET_USER_TOKEN, GET_ROLES } from '../../../utils/graphql';
import { checkRoleIsAllowed } from '../../../utils/utils';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  branch(
    ({getUserToken: { loggedInUser = {} }}) =>
      _.isEmpty(loggedInUser) || !checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.read_user.value),
    renderNothing
  ),
  graphql(GET_FULL_USERS, { name: 'getUsers' }),
  graphql(GET_ROLES(['id', 'name', 'accessPermission']), { name: 'getRoles' }),
  graphql(REMOVE_USER, { name: 'removeUser' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin/dashboard', icon: 'home', text: 'categories.home' },
      { text: 'categories.users' }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    ({ detailModalVisible = false, selectedUser = {} }) => ({ detailModalVisible, selectedUser }),
    {
      toggleDetailModal: () => (selectedUser = {}) =>
        ({ detailModalVisible: Object.keys(selectedUser).length > 0, selectedUser })
    }
  ),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    onRemoveUser: ({ removeUser, setAlertContent, setAlert }) => async id => {
      const result = confirm('Do you want to remove this user?');
      if (result) {
        try {
          await removeUser({
            variables: { id },
            optimisticResponse: {
              __typename: 'Mutation',
              removeUser: {
                __typename: 'String',
                id
              }
            },
            update(cache, { data: { removeUser } }) {
              let { users } = cache.readQuery({ query: GET_FULL_USERS });
              users = users.filter(item => item.id !== removeUser);
              cache.writeQuery({ query: GET_FULL_USERS, data: { users } });
            }
          });

          setAlertContent('Remove user successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent(e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    },
    usersNormalizer: ({ getUsers: { users = [] } }) => () => {
      const userCloned = _.cloneDeep(users);
      for (let index = 0; index < userCloned.length; index++) {
        userCloned[index].role = userCloned[index].role.name;
      }
      return userCloned;
    }
  })
)(AdminContentUsersComponent);