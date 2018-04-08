import { compose, withHandlers, withState, withStateHandlers, withProps } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentUsersComponent from '../../../components/admin/admin-content/admin-content-users';
import { ALERT_STATUS } from '../../../commons/enum';
import { GET_FULL_USERS, REMOVE_USER } from '../../../utils/graphql';

export default compose(
  graphql(GET_FULL_USERS, { name: 'getUsers' }),
  graphql(REMOVE_USER, { name: 'removeUser' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Users' }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    null,
    {
      removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    }
  ),
  withHandlers({
    onRemoveUser: ({ removeUser }) => e => {
      const { id } = e.currentTarget.dataset;
      
      const result = confirm('Do you want to remove this user?');
      if (result) {
        removeUser({
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
      }
    }
  })
)(AdminContentUsersComponent);