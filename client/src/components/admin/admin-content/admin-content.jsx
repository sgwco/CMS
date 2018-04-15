import React from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import { compose } from 'recompose';

import AdminContentPostsContainer from '../../../containers/admin//admin-content/admin-content-posts';
import AdminContentPostsFormContainer from '../../../containers/admin/admin-content/admin-content-posts-form';

import AdminContentPostCategoryFormContainer from '../../../containers/admin/admin-content/admin-content-posts-category-form';
import AdminContentPostCategoryContainer from '../../../containers/admin/admin-content/admin-content-posts-category';

import AdminContentPackageContainer from '../../../containers/admin/admin-content/admin-content-package';
import AdminContentPackageFormContainer from '../../../containers/admin/admin-content/admin-content-package-form';

import AdminContentSubscriptionContainer from '../../../containers/admin/admin-content/admin-content-subscription';
import AdminContentSubscriptionFormContainer from '../../../containers/admin/admin-content/admin-content-subscription-form';

import AdminContentUsersContainer from '../../../containers/admin/admin-content/admin-content-users';
import AdminContentUsersFormContainer from '../../../containers/admin/admin-content/admin-content-users-form';

import AdminContentRolesContainer from '../../../containers/admin/admin-content/admin-content-roles';
import AdminContentRolesFormContainer from '../../../containers/admin/admin-content/admin-content-roles-form';

const AdminContentComponent = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}/post`} component={AdminContentPostsContainer} />
    <Route exact path={`${match.url}/post/add-new`} component={AdminContentPostsFormContainer} />
    <Route exact path={`${match.url}/post/edit/:id`} render={props => <AdminContentPostsFormContainer {...props} isEditedUser={true}  />} />

    <Route exact path={`${match.url}/post/category`} component={AdminContentPostCategoryContainer} />
    <Route exact path={`${match.url}/post/category/add-new`} component={AdminContentPostCategoryFormContainer} />
    <Route exact path={`${match.url}/post/category/edit/:id`} render={props => <AdminContentPostCategoryFormContainer {...props} isEditedUser={true}  />} />

    <Route exact path={`${match.url}/package`} component={AdminContentPackageContainer} />
    <Route exact path={`${match.url}/package/add-new`} component={AdminContentPackageFormContainer} />
    <Route exact path={`${match.url}/package/edit/:id`} render={props => <AdminContentPackageFormContainer {...props} isEditedPackage={true}  />} />

    <Route exact path={`${match.url}/subscription`} component={AdminContentSubscriptionContainer} />
    <Route exact path={`${match.url}/subscription/add-new`} component={AdminContentSubscriptionFormContainer} />
    <Route exact path={`${match.url}/subscription/edit/:id`} render={props => <AdminContentSubscriptionFormContainer {...props} isEditedSubscription={true}  />} />
    
    <Route exact path={`${match.url}/user`} component={AdminContentUsersContainer} />
    <Route exact path={`${match.url}/user/add-new`} component={AdminContentUsersFormContainer} />
    <Route exact path={`${match.url}/user/edit/:id`} render={props => <AdminContentUsersFormContainer {...props} isEditedUser={true}  />} />

    <Route exact path={`${match.url}/role`} component={AdminContentRolesContainer} />
    <Route exact path={`${match.url}/role/add-new`} component={AdminContentRolesFormContainer} />
    <Route exact path={`${match.url}/role/edit/:id`} render={props => <AdminContentRolesFormContainer {...props} isEditedUser={true} />} />
  </Switch>
);

export default compose(
  withRouter
)(AdminContentComponent);