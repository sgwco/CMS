import React from 'react';
import { Route, withRouter } from 'react-router-dom';

import AdminContentPostsComponent from './admin-content-posts/admin-content-posts';
import AdminContentUsersComponent from './admin-content-users/admin-content-users';
import AdminContentUsersFormComponent from './admin-content-users-form/admin-content-users-form';
import AdminContentRolesComponent from './admin-content-roles/admin-content-roles';
import AdminContentRolesFormComponent from './admin-content-roles-form/admin-content-roles-form';

const adminContent = [
  {
    title: 'Post',
    href: 'post'
  }
];

const AdminContentComponent = ({ match }) => (
  <div className="content-wrapper">
    {adminContent.map((item, index) => (
      <Route key={index} exact path={`${match.url}/${item.href}`} render={() => <AdminContentPostsComponent {...item} />} />
    ))}
    <Route exact path={`${match.url}/user`} component={AdminContentUsersComponent} />
    <Route exact path={`${match.url}/user/add-new`} component={AdminContentUsersFormComponent} />
    <Route exact path={`${match.url}/user/edit/:id`} render={props => <AdminContentUsersFormComponent {...props} isEditedUser={true}  />} />

    <Route exact path={`${match.url}/role`} component={AdminContentRolesComponent} />
    <Route exact path={`${match.url}/role/add-new`} component={AdminContentRolesFormComponent} />
    <Route exact path={`${match.url}/role/edit/:id`} render={props => <AdminContentRolesFormComponent {...props} isEditedUser={true} />} />
  </div>
);

export default withRouter(AdminContentComponent);