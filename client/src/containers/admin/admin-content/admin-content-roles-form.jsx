import { compose, branch, lifecycle, withProps, withState, withStateHandlers, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';

import { CREATE_ROLE, EDIT_ROLE, GET_ROLE_BY_ID, GET_ROLES } from '../../../utils/graphql';
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
  withState('checkboxSelectAll', 'setCheckboxSelectAll', false),
  withStateHandlers(
    null,
    {
      removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    }),
  withHandlers({
    selectAllRoles: ({ listRoles, checkboxSelectAll, setCheckboxSelectAll }) => (formApi) => {
      const roleClone = Object.assign({}, roleCapabilities);
      for (let index = 0; index < listRoles.length; index += 1) {
        roleClone[listRoles[index]] = !checkboxSelectAll;
      }

      const roles = listRoles.map(item => {
        const obj = {};
        obj[item] = !checkboxSelectAll;
        return obj;
      });

      setCheckboxSelectAll(!checkboxSelectAll);
      roles.forEach(item => {
        const [key] = Object.keys(item);

        if (key) {
          formApi.setValue(key, item[key]);
        }
      });
    },
    saveRole: ({ isEditedUser, match, editRole, createRole, setAlertContent, setAlert }) => ({ roleName, ...roles }) => {
      const accessPermission = Object.keys(roles).filter(item => roles[item]).map(item => roleCapabilities[item].value).reduce((total, num) => total + num);

      const variables = {
        name: roleName,
        accessPermission
      };
  
      if (isEditedUser) {
        variables.id = match.params.id;
        editRole({ variables });
      }
      else {
        createRole({
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            createRole: {
              __typename: 'String',
              id: Math.round(Math.random() * -1000000),
              name: roleName,
              accessPermission
            }
          },
          update(cache, { data: { createRole } }) {
            try {
              const { roles } = cache.readQuery({ query: GET_ROLES(['id', 'name', 'accessPermission']) });
              roles.push(createRole);
              cache.writeQuery({ query: GET_ROLES(['id', 'name', 'accessPermission']), data: { roles } });
            }
            catch (e) {
              // Nothing here
            }
          }
        });
        setAlertContent('Add role successfully');
        setAlert(ALERT_STATUS.SUCCESS);
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