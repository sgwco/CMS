import React from 'react';
import styled from 'styled-components';
import FontAwesome from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { DropdownToggle, DropdownItem, Nav, Navbar, NavItem, UncontrolledDropdown, DropdownMenu } from 'reactstrap';

import avatar from '../../assets/img/user.png';

const AdminTopbarProfileComponent = ({
  getUserToken: { loggedInUser },
  logout
}) => (
  <UncontrolledDropdownStyled className="user user-menu" nav inNavbar>
    <DropdownToggle nav caret>
      <img src={avatar} className="user-image" alt="User Image" />
      <span className="hidden-xs">{loggedInUser && (loggedInUser.fullname || loggedInUser.username)}</span>
    </DropdownToggle>
    <DropdownMenuStyled className="dropdown">
      <DropdownItem className="user-header">
        <img src={avatar} className="rounded-circle" alt="User Image" />
        <p>
          {loggedInUser && (loggedInUser.fullname || loggedInUser.username)}<br/>
          <small><FormattedMessage id='member_since' values={{ date: moment(loggedInUser.registrationDate).format('DD/MM/YYYY') }} /></small>
        </p>
      </DropdownItem>
      <LogoutStyled onClick={logout}>
        <FontAwesome icon="sign-out-alt" /> <FormattedMessage id='logout' />
      </LogoutStyled>
    </DropdownMenuStyled>
  </UncontrolledDropdownStyled>
);

const AdminTopbarComponent = ({
  logo,
  getUserToken,
  logout,
  toggleSidebar,
  getSettings: { settings = [] },
}) => (
  <header className="main-header">
    <a href="#" className="logo">
      <span className="logo-mini">
        <LogoImageStyled src={logo} alt="logo" className="logo-img-mini" />
      </span>
      <span className="logo-lg">
        <LogoImageStyled src={logo} alt="logo" className="logo-img-lg" /> {(settings.find(item => item.settingKey === 'company_name') || {}).settingValue}
      </span>
    </a>
    <NavbarStyled className="navbar navbar-static-top">
      <NavItemStyled className="nav-item">
        <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button" onClick={toggleSidebar}>
          <FontAwesome icon='bars' />
        </a>
      </NavItemStyled>
      <NavItemStyled className="nav-item navbar-custom-menu">
        <Nav navbar className="nav">
          <AdminTopbarProfileComponent getUserToken={getUserToken} logout={logout} />
        </Nav>
      </NavItemStyled>
    </NavbarStyled>
  </header>
);

export const LogoImageStyled = styled.img`
  height: 80%;
`;

export const NavbarStyled = styled(Navbar)`
  padding: 0 !important;
`;

export const NavItemStyled = styled(NavItem)`
  list-style-type: none;
`;

export const UncontrolledDropdownStyled = styled(UncontrolledDropdown)`
  padding: 5px 15px;
`;

export const DropdownMenuStyled = styled(DropdownMenu)`
  border-radius: 0 !important;
  border: none !important;
`;

export const LogoutStyled = styled(DropdownItem)`
  border: 1px solid rgba(0, 0, 0, 0.4) !important;
  border-top: none !important;
  &:hover {
    cursor: pointer;
  }
`;

export default AdminTopbarComponent;