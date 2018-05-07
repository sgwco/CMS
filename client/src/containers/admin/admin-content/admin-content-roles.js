import { graphql } from 'react-apollo';
import { compose, withHandlers, withStateHandlers, withProps, withState } from 'recompose';

import AdminContentRolesComponent from '../../../components/admin/admin-content/admin-content-roles';
import { GET_ROLES, REMOVE_ROLE } from '../../../utils/graphql';
import { ALERT_STATUS } from '../../../utils/enum';

export default compose(
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
  withStateHandlers(
    null,
    {
      removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    }
  ),
  withHandlers({
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