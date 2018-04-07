import React from 'react';
import { graphql } from 'react-apollo';
import { compose, withHandlers, withStateHandlers } from 'recompose';

import AdminContentRolesComponent from '../../../components/admin/admin-content/admin-content-roles';
import { GET_ROLES, REMOVE_ROLE } from '../../../utils/graphql';
import { ALERT_STATUS } from '../../../commons/enum';

const AdminContentRolesContainer = (props) => (
  <AdminContentRolesComponent {...props} />
);

export default compose(
  graphql(GET_ROLES(['id', 'name', 'accessPermission']), { name: 'getRoles' }),
  graphql(REMOVE_ROLE, { name: 'removeRole' }),
  withStateHandlers(
    () => ({
      alertVisible: ALERT_STATUS.HIDDEN,
      alertContent: '',
      breadcrumbItems: [
        { url: '/admin', icon: 'home', text: 'Home' },
        { text: 'Roles' }
      ]
    }),
    {
      setAlert: () => (alertVisible) => ({ alertVisible }),
      setAlertContent: () => (alertContent) => ({ alertContent }),
      removeAlert: () => () => ({ alertVisible: ALERT_STATUS.HIDDEN })
    }
  ),
  withHandlers({
    onRemoveRole: ({ removeRole, setAlert, setAlertContent }) => id => {
      const result = confirm('Do you want to remove this role?');
      if (result) {
        removeRole({
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
    }
  })
)(AdminContentRolesContainer);