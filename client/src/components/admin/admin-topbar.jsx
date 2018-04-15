import React from 'react';
import styled from 'styled-components';
import FontAwesome from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { DropdownToggle, DropdownItem, Nav, Navbar, NavItem, UncontrolledDropdown, DropdownMenu } from 'reactstrap';

const AdminTopbarProfileComponent = ({
  getUserToken: { loggedInUser }
}) => (
  <UncontrolledDropdownStyled className="user user-menu" nav inNavbar>
    <DropdownToggle nav caret>
      <img src="https://graph.facebook.com/100006945288953/picture?type=square" className="user-image" alt="User Image" />
      <span className="hidden-xs">{loggedInUser && (loggedInUser.fullname || loggedInUser.username)}</span>
    </DropdownToggle>
    <DropdownMenuStyled className="dropdown">
      <DropdownItem className="user-header">
        <img src="https://graph.facebook.com/100006945288953/picture?type=square" className="rounded-circle" alt="User Image" />
        <p>
          {loggedInUser && (loggedInUser.fullname || loggedInUser.username)}<br/>
          <small>Member since {loggedInUser && moment(loggedInUser.registrationDate).format('MMM. YYYY')}</small>
        </p>
      </DropdownItem>
    </DropdownMenuStyled>
  </UncontrolledDropdownStyled>
);

const AdminTopbarComponent = ({
  companyName,
  logo,
  getUserToken
}) => (
  <header className="main-header">
    <a href="#" className="logo">
      <span className="logo-mini">
        <LogoImageStyled src={logo} alt="logo" className="logo-img-mini" />
      </span>
      <span className="logo-lg">
        <LogoImageStyled src={logo} alt="logo" className="logo-img-lg" /> {companyName}
      </span>
    </a>
    <NavbarStyled className="navbar navbar-static-top">
      <NavItemStyled className="nav-item">
        <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
          <FontAwesome icon='bars' />
        </a>
      </NavItemStyled>
      <NavItemStyled className="nav-item navbar-custom-menu">
        <Nav navbar className="nav">
          <AdminTopbarProfileComponent getUserToken={getUserToken} />
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

export default AdminTopbarComponent;