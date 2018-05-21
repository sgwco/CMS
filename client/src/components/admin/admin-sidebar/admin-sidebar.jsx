import React from 'react';
import { compose, withHandlers } from 'recompose';
// import { Button, InputGroup, InputGroupAddon, Input } from 'reactstrap';
// import FontAwesome from '@fortawesome/react-fontawesome';

import AdminSidebarMenuComponent from './admin-sidebar-menu';
import lang from '../../../languages';
// import styled from 'styled-components';

const AdminSidebarComponent = ({
  getUserToken: { loggedInUser },
  profile: { avatar },
  listMenus,
  checkRoleAllowed,
  language
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
        <li className="header">{lang('main_navigation', language).toUpperCase()}</li>
        {listMenus.map((item, index) => [
          loggedInUser && checkRoleAllowed(loggedInUser.role.accessPermission, item.readPermission) !== 0 && (
            <AdminSidebarMenuComponent
              key={index}
              menuItem={item}
              title={item.title}
              href={item.href}
              icon={item.icon}
              subMenu={item.subMenu}
              badgePrimary={item.badgePrimary}
              isSeparator={item.separator}
            />
          )
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