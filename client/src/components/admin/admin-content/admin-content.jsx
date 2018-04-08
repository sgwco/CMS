import React from 'react';
import { Route, withRouter } from 'react-router-dom';

import AdminContentPostsComponent from './admin-content-posts/admin-content-posts';
import AdminContentUsersContainer from '../../../containers/admin/admin-content/admin-content-users';
import AdminContentUsersFormComponent from './admin-content-users-form/admin-content-users-form';
import AdminContentRolesContainer from '../../../containers/admin/admin-content/admin-content-roles';
import AdminContentRolesFormContainer from '../../../containers/admin/admin-content/admin-content-roles-form';

const adminContent = [
  {
    title: 'Post',
    href: 'post'
  }
];

const AdminContentComponent = ({ match }) => (
  <div>
    {adminContent.map((item, index) => (
      <Route key={index} exact path={`${match.url}/${item.href}`} render={() => <AdminContentPostsComponent {...item} />} />
    ))}
    <Route exact path={`${match.url}/user`} component={AdminContentUsersContainer} />
    <Route exact path={`${match.url}/user/add-new`} component={AdminContentUsersFormComponent} />
    <Route exact path={`${match.url}/user/edit/:id`} render={props => <AdminContentUsersFormComponent {...props} isEditedUser={true}  />} />

    <Route exact path={`${match.url}/role`} component={AdminContentRolesContainer} />
    <Route exact path={`${match.url}/role/add-new`} component={AdminContentRolesFormContainer} />
    <Route exact path={`${match.url}/role/edit/:id`} render={props => <AdminContentRolesFormContainer {...props} isEditedUser={true} />} />
  </div>
);

export default withRouter(AdminContentComponent);