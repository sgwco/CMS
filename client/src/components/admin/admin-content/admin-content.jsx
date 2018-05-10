import React from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import _ from 'lodash';

import AdminContentDashboardContainer from '../../../containers/admin//admin-content/admin-content-dashboard';

// import AdminContentPostsContainer from '../../../containers/admin//admin-content/admin-content-posts';
// import AdminContentPostsFormContainer from '../../../containers/admin/admin-content/admin-content-posts-form';

// import AdminContentPostCategoryFormContainer from '../../../containers/admin/admin-content/admin-content-posts-category-form';
// import AdminContentPostCategoryContainer from '../../../containers/admin/admin-content/admin-content-posts-category';

import AdminContentPackageContainer from '../../../containers/admin/admin-content/admin-content-package';
import AdminContentPackageFormContainer from '../../../containers/admin/admin-content/admin-content-package-form';
import AdminContentUsersContainer from '../../../containers/admin/admin-content/admin-content-users';
import AdminContentUsersFormContainer from '../../../containers/admin/admin-content/admin-content-users-form';
import AdminContentRolesContainer from '../../../containers/admin/admin-content/admin-content-roles';
import AdminContentRolesFormContainer from '../../../containers/admin/admin-content/admin-content-roles-form';
import AdminContentSettingContainer from '../../../containers/admin/admin-content/admin-content-setting';
import { checkRoleIsAllowed } from '../../../utils/utils';
import { ROLE_CAPABILITIES } from '../../../utils/enum';

const AdminContentComponent = ({ match, getUserToken: { loggedInUser = {} } }) => (
  !_.isEmpty(loggedInUser) && (
    <Switch>
      <Route exact path={`${match.url}/dashboard`} component={AdminContentDashboardContainer} />

      {/* <Route exact path={`${match.url}/post`} component={AdminContentPostsContainer} />
      <Route exact path={`${match.url}/post/add-new`} component={AdminContentPostsFormContainer} />
      <Route exact path={`${match.url}/post/edit/:id`} render={props => <AdminContentPostsFormContainer {...props} isEditedUser={true}  />} />

      <Route exact path={`${match.url}/post/category`} component={AdminContentPostCategoryContainer} />
      <Route exact path={`${match.url}/post/category/add-new`} component={AdminContentPostCategoryFormContainer} />
      <Route exact path={`${match.url}/post/category/edit/:id`} render={props => <AdminContentPostCategoryFormContainer {...props} isEditedUser={true}  />} /> */}

      {checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.read_packages.value) && (
        <Route exact path={`${match.url}/package`} component={AdminContentPackageContainer} />
      )}
      {checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.write_packages.value) && (
        <Route exact path={`${match.url}/package/add-new`} component={AdminContentPackageFormContainer} />
      )}
      {/* <Route exact path={`${match.url}/package/edit/:id`} render={props => <AdminContentPackageFormContainer {...props} isEditedPackage={true}  />} /> */}
      
      {checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.read_user.value) && (
        <Route exact path={`${match.url}/user`} component={AdminContentUsersContainer} />
      )}
      {checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.write_user.value) && ([
        <Route exact path={`${match.url}/user/add-new`} component={AdminContentUsersFormContainer} key={1} />,
        <Route exact path={`${match.url}/user/edit/:id`} render={props => <AdminContentUsersFormContainer {...props} isEditedUser={true} />} key={2} />
      ])}
      
      {checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.read_roles.value) && (
        <Route exact path={`${match.url}/role`} component={AdminContentRolesContainer} />
      )}
      {checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.write_roles.value) && ([
        <Route exact path={`${match.url}/role/add-new`} component={AdminContentRolesFormContainer} key={1} />,
        <Route exact path={`${match.url}/role/edit/:id`} render={props => <AdminContentRolesFormContainer {...props} isEditedUser={true} />} key={2} />
      ])}

      {checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.setting.value) && (
        <Route exact path={`${match.url}/setting`} component={AdminContentSettingContainer} />
      )}
    </Switch>
  )
);

export default compose(
  withRouter,
  lifecycle({
    componentWillMount() {
      if (this.props.location.pathname === '/admin') {
        this.props.history.push('/admin/dashboard');
      }
    }
  })
)(AdminContentComponent);