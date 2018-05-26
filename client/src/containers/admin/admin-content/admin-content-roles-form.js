import { compose, branch, withProps, withState, withHandlers, renderNothing } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';
import _ from 'lodash';

import { CREATE_ROLE, EDIT_ROLE, GET_ROLES, GET_USER_TOKEN } from '../../../utils/graphql';
import { ALERT_STATUS, ROLE_CAPABILITIES } from '../../../utils/enum';
import AdminContentRolesFormComponent from '../../../components/admin/admin-content/admin-content-roles-form';
import { checkRoleIsAllowed } from '../../../utils/utils';

function checkRoleAllowed(permission, role) {
  return permission & role;
}

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  branch(
    ({getUserToken: { loggedInUser = {} }}) =>
      _.isEmpty(loggedInUser) || !checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.write_roles.value),
    renderNothing
  ),
  withApollo,
  withRouter,
  branch(
    ({ isEditedUser }) => isEditedUser,
    graphql(EDIT_ROLE, { name: 'editRole' }),
    graphql(CREATE_ROLE, { name: 'createRole' })
  ),
  withHandlers({
    renderTopTitle: ({ isEditedUser }) => () => isEditedUser ? 'edit_role.edit' : 'edit_role.add_new',
  }),
  withProps(({ renderTopTitle }) => ({
    listRoles: Object.keys(ROLE_CAPABILITIES),
    breadcrumbItems: [
      { url: '/admin/dashboard', icon: 'home', text: 'categories.home' },
      { url: '/admin/role', icon: 'users', text: 'categories.roles' },
      { text: renderTopTitle() }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    selectAllRoles: ({ listRoles }) => (e, formApi) => {
      const roles = listRoles.map(item => {
        const obj = {};
        obj[item] = e.currentTarget.checked;
        return obj;
      });

      roles.forEach(item => {
        const [key] = Object.keys(item);

        if (key) {
          formApi.setValue(key, item[key]);
        }
      });
    },
    saveRole: ({ isEditedUser, match, editRole, createRole, setAlertContent, setAlert }) => async ({ roleName, ...roles }) => {
      try {
        const accessPermission = Object.keys(roles).filter(item => roles[item]).map(item => ROLE_CAPABILITIES[item].value).reduce((total, num) => total + num, 0);

        const variables = {
          name: roleName,
          accessPermission
        };
    
        if (isEditedUser) {
          variables.id = match.params.id;
          await editRole({
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              editRole: {
                __typename: 'String',
                id: Math.round(Math.random() * -1000000),
                name: roleName,
                accessPermission
              }
            },
            update(cache, { data: { editRole } }) {
              try {
                const { roles } = cache.readQuery({ query: GET_ROLES(['id', 'name', 'accessPermission']) });
                const index = roles.findIndex(item => item.id === match.params.id);
                roles[index] = editRole;
                cache.writeQuery({ query: GET_ROLES(['id', 'name', 'accessPermission']), data: { roles } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });

          setAlertContent('success.edit');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        else {
          await createRole({
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              createRole: {
                __typename: 'Role',
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
          setAlertContent('success.create');
          setAlert(ALERT_STATUS.SUCCESS);
        }
      }
      catch (e) {
        setAlertContent(e.graphQLErrors[0].message);
        setAlert(ALERT_STATUS.ERROR);
      }
    },
    initValue: ({ isEditedUser, client, listRoles, history, match }) => async (formApi) => {
      if (isEditedUser) {
        try {
          const { roles } = client.cache.readQuery({ query: GET_ROLES(['id', 'name', 'accessPermission']) });
          const selectedRole = roles.find(item => item.id === match.params.id);
          if (!selectedRole) throw new Error('error.role_not_exist');

          listRoles.forEach((item, index) => {
            if (checkRoleAllowed(selectedRole.accessPermission, ROLE_CAPABILITIES[listRoles[index]].value)) {
              formApi.setValue(listRoles[index], true);
            }
          });

          formApi.setValue('roleName', selectedRole.name);
        }
        catch (e) {
          history.push('/admin/role');
        }
      }
    }
  }),
)(AdminContentRolesFormComponent);