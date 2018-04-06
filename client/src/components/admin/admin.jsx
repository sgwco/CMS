import React from 'react';
import AdminTopBarComponent from './admin-topbar/admin-topbar';
import AdminSidebarContainer from '../../containers/admin/admin-sidebar/admin-sidebar';
import AdminContentContainer from './admin-content/admin-content';
import logo from '../../assets/img/logo.png';

const AdminComponent = () => (
  <div className="wrapper">
    <AdminTopBarComponent logo={logo} companyName="Sai Gon Web" />
    <AdminSidebarContainer />
    <AdminContentContainer />
  </div>
);

export default AdminComponent;