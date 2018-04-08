import { compose, branch, lifecycle, withProps, withState, withStateHandlers, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';

import { CREATE_ROLE, EDIT_ROLE, GET_ROLE_BY_ID } from '../../../utils/graphql';
import { ALERT_STATUS } from '../../../commons/enum';
import AdminContentRolesFormComponent from '../../../components/admin/admin-content/admin-content-roles-form';
import { roleCapabilities } from '../../../commons/enum';

function checkRoleAllowed(permission, role) {
  return permission & role;
}

export default compose(
  withApollo,
  withRouter,
  branch(
    ({ isEditedUser }) => isEditedUser,
    graphql(EDIT_ROLE, { name: 'editRole' }),
    graphql(CREATE_ROLE, { name: 'createRole' })
  ),
  withHandlers({
    renderTopTitle: ({ isEditedUser }) => () => isEditedUser ? 'Edit Role' : 'Add New Role',
  }),
  withProps(({ renderTopTitle }) => ({
    listRoles: Object.keys(roleCapabilities),
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { url: '/admin/role', icon: 'users', text: 'Roles' },
      { text: renderTopTitle() }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withState('roleName', 'setRoleName', ''),
  withState('rolesSelected', 'setRoles', []),
  withState('checkboxSelectAll', 'setCheckboxSelectAll', false),
  withStateHandlers(
    null,
    {
      removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    }),
  withHandlers({
    selectRole: ({ listRoles, setRoles, setCheckboxSelectAll }) => (event) => {
      const roleClone = Object.assign({}, roleCapabilities);
      const { role } = event.target.dataset;
      const availableRoles = Object.keys(roleClone);
  
      roleClone[role] = roleClone[role] ? !roleClone[role] : true;
      const checkboxUnselectedRole = listRoles.findIndex(role => roleClone[role] === false);

      setRoles(roleClone);
      console.log(roleClone);
      setCheckboxSelectAll(checkboxUnselectedRole === -1 && availableRoles.length === listRoles.length);
    },
    selectAllRoles: ({ listRoles, checkboxSelectAll, setRoles, setCheckboxSelectAll }) => () => {
      const roleClone = Object.assign({}, roleCapabilities);
      for (let index = 0; index < listRoles.length; index += 1) {
        roleClone[listRoles[index]] = !checkboxSelectAll;
      }

      setRoles(roleClone);
      setCheckboxSelectAll(checkboxSelectAll);
    },
    saveRole: ({ isEditedUser, match, roleCapabilities, listRoles, roleName, editRole, createRole }) => async () => {
      let accessPermission = 0;
  
      for (let index = 0; index < listRoles.length; index += 1) {
        if (roleCapabilities[listRoles[index]])
          accessPermission += roleCapabilities[listRoles[index]].value;
      }
      const variables = {
        name: roleName,
        accessPermission
      };
  
      if (isEditedUser) {
        variables.id = match.params.id;
        editRole({ variables });
      }
      else {
        createRole({ variables });
      }
    }
  }),
  lifecycle({
    async componentWillMount() {
      const { isEditedUser, client, match, history, listRoles, setRoleName, setRoleCapabilities, setCheckboxSelectAll } = this.props;
      if (isEditedUser) {
        try {
          const { data } = await client.query({
            query: GET_ROLE_BY_ID,
            variables: { id: match.params.id }
          });
          const roles = {};
          let checkboxSelectAll = false;
  
          for (let index = 0; index < listRoles.length; index += 1) {
            if (checkRoleAllowed(data.role.accessPermission, roleCapabilities[listRoles[index]].value)) {
              roles[listRoles[index]] = true;
            }
          }
  
          if (Object.keys(roles).length === listRoles.length) {
            checkboxSelectAll = true;
          }

          setRoleName(data.role.name);
          setRoleCapabilities(roleCapabilities);
          setCheckboxSelectAll(checkboxSelectAll);
        }
        catch (e) {
          history.push('/admin/role');
        }
      }
    }
  })
)(AdminContentRolesFormComponent);