import React from 'react';
import AdminTopBarComponent from './admin-topbar/admin-topbar';
import AdminSidebarContainer from './admin-sidebar/admin-sidebar';
import AdminContentContainer from './admin-content/admin-content';

export default class AdminComponent extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <AdminTopBarComponent />
        <AdminSidebarContainer />
        <AdminContentContainer />
      </div>
    );
  }
}