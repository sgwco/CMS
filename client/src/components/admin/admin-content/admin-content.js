import React from 'react';
import { Route } from 'react-router-dom';

import AdminContentPostsComponent from './admin-content-posts/admin-content-posts';
// import styles from './admin-content.css';

const adminContent = [
  {
    title: 'Post',
    href: 'post'
  }
];

export default class AdminContentComponent extends React.Component {
  renderComponent = () => {
    return (
      <AdminContentPostsComponent />
    );
  }

  renderRoute = (item, index) => {
    const { match } = this.props;
    return (
      <Route
        key={index}
        exact
        path={`${match.url}/${item.href}`}
        render={() => <AdminContentPostsComponent {...item} />}
      />
    );
  }

  render() {
    return (
      <div className="content-wrapper">
        {adminContent.map(this.renderRoute)}
      </div>
    );
  }
}