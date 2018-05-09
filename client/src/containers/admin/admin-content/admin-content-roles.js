import { graphql } from 'react-apollo';
import { compose, withHandlers, withProps, withState, branch, renderNothing } from 'recompose';
import _ from 'lodash';

import AdminContentRolesComponent from '../../../components/admin/admin-content/admin-content-roles';
import { GET_ROLES, REMOVE_ROLE, GET_USER_TOKEN } from '../../../utils/graphql';
import { ALERT_STATUS, ROLE_CAPABILITIES } from '../../../utils/enum';
import { checkRoleIsAllowed } from '../../../utils/utils';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  branch(
    ({getUserToken: { loggedInUser = {} }}) =>
      _.isEmpty(loggedInUser) || !checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.read_roles.value),
    renderNothing
  ),
  graphql(GET_ROLES(['id', 'name', 'accessPermission']), { name: 'getRoles' }),
  graphql(REMOVE_ROLE, { name: 'removeRole' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Roles' }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    onRemoveRole: ({ removeRole, setAlert, setAlertContent }) => async id => {
      const result = confirm('Do you want to remove this role?');
      if (result) {
        try {
          await removeRole({
            variables: { id },
            optimisticResponse: {
              __typename: 'Mutation',
              removeRole: {
                __typename: 'String',
                id
              }
            },
            update(cache, { data: { removeRole } }) {
              let { roles } = cache.readQuery({ query: GET_ROLES(['id', 'name', 'accessPermission']) });
              roles = roles.filter(item => item.id !== removeRole);
              cache.writeQuery({ query: GET_ROLES(['id', 'name', 'accessPermission']), data: { roles } });
            }
          });
          setAlertContent('Remove role successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent('Error: ' + e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    }
  })
)(AdminContentRolesComponent);