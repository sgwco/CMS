import React from 'react';
import { Route, withRouter } from 'react-router-dom';

import AdminContentPostsComponent from './admin-content-posts/admin-content-posts';
import AdminContentUsersComponent from './admin-content-users/admin-content-users';
import AdminContentUsersFormComponent from './admin-content-users-form/admin-content-users-form';

const adminContent = [
  {
    title: 'Post',
    href: 'post'
  }
];

class AdminContentComponent extends React.Component {
  renderRoute = (item, index) => {
    const { match } = this.props;
    return (
      <Route key={index} exact path={`${match.url}/${item.href}`} render={() => <AdminContentPostsComponent {...item} />} />
    );
  }

  render() {
    const { match } = this.props;
    return (
      <div className="content-wrapper">
        {adminContent.map(this.renderRoute)}
        <Route exact path={`${match.url}/user`} render={() => <AdminContentUsersComponent />} />
        <Route exact path={`${match.url}/user/add-new`} render={() => <AdminContentUsersFormComponent />} />
      </div>
    );
  }
}

export default withRouter(AdminContentComponent);