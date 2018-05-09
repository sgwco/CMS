import React from 'react';
import AdminTopBarContainer from '../../containers/admin/admin-topbar';
import AdminSidebarContainer from '../../containers/admin/admin-sidebar/admin-sidebar';
import AdminContentContainer from '../../containers/admin/admin-content/admin-content';
import logo from '../../assets/img/logo.png';

const AdminComponent = () => (
  <div className="wrapper">
    <AdminTopBarContainer logo={logo} companyName="Sai Gon Web" />
    <AdminSidebarContainer />
    <AdminContentContainer />
  </div>
);

export default AdminComponent;