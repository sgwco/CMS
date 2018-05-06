import React from 'react';
import { compose, withHandlers } from 'recompose';
// import { Button, InputGroup, InputGroupAddon, Input } from 'reactstrap';
// import FontAwesome from '@fortawesome/react-fontawesome';

import AdminSidebarMenuComponent from './admin-sidebar-menu';
// import styled from 'styled-components';

const AdminSidebarComponent = ({
  getUserToken: { loggedInUser },
  profile: { avatar },
  menuData,
  checkRoleAllowed
}) => (
  <aside className="main-sidebar">
    <section className="sidebar">
      <div className="user-panel">
        <div className="float-left image">
          <img src={avatar} className="rounded-circle" alt="User Image" />
        </div>
        <div className="float-left info">
          <p>{loggedInUser && (loggedInUser.fullname || loggedInUser.username)}</p>
          <a href="#">{loggedInUser && loggedInUser.role.name}</a>
        </div>
      </div>
      {/* <form action="#" method="get" className="sidebar-form">
        <InputGroup>
          <SearchInputStyled type="text" placeholder="Search..." />
          <InputGroupAddon addonType='append'>
            <Button className="btn-flat" type="submit" name="search" id="search-btn">
              <FontAwesome icon='search' />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </form> */}
      <ul className="sidebar-menu" data-widget="tree">
        {menuData.map((item, itemIndex) => [
          loggedInUser && checkRoleAllowed(loggedInUser.role.accessPermission, item.showPermission) !== 0 && (
            <li key={itemIndex} className="header">{item.header}</li>
          ),
          item.menus.map((menuItem, menuIndex) => (
            loggedInUser && checkRoleAllowed(loggedInUser.role.accessPermission, menuItem.readPermission) !== 0 && (
              <AdminSidebarMenuComponent
                key={menuIndex}
                title={menuItem.title}
                href={menuItem.href}
                icon={menuItem.icon}
                subMenu={menuItem.subMenu}
                badgePrimary={menuItem.badgePrimary}
              />
            )
          ))
        ])}
      </ul>
    </section>
  </aside>
);

// const SearchInputStyled = styled(Input)`
//   border: none !important;
// `;

export default compose(
  withHandlers({
    checkRoleAllowed: () => (accessPermission, permission) => {
      if (!permission) return 1;
      return accessPermission & permission;
    }
  })
)(AdminSidebarComponent);