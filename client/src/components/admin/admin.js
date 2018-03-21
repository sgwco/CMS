import React from 'react';
import AdminTopBarComponent from './admin-topbar/admin-topbar';

export default class AdminComponent extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <AdminTopBarComponent />
      </div>
    );
  }
}