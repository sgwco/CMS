import React from 'react';
import AdminTopBarContainer from '../../containers/admin/admin-topbar';
import AdminSidebarContainer from '../../containers/admin/admin-sidebar/admin-sidebar';
import AdminContentContainer from '../../containers/admin/admin-content/admin-content';
import logo from '../../assets/img/logo.png';

const AdminComponent = ({ collapseSidebar, toggleSidebar }) => (
  <div className={`wrapper sidebar-mini ${collapseSidebar && 'sidebar-collapse'}`}>
    <AdminTopBarContainer logo={logo} toggleSidebar={toggleSidebar} />
    <AdminSidebarContainer />
    <AdminContentContainer />
  </div>
);

export default AdminComponent;