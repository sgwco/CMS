import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { DropdownToggle, DropdownItem, Nav } from 'reactstrap';
import { LogoImageStyled, NavbarStyled, NavItemStyled, UncontrolledDropdownStyled, DropdownMenuStyled } from './admin-topbar.style';

const AdminTopbarProfileComponent = ({ fullname, registrationDate }) => (
  <UncontrolledDropdownStyled className="user user-menu" nav inNavbar>
    <DropdownToggle nav caret>
      <img src="https://graph.facebook.com/100006945288953/picture?type=square" className="user-image" alt="User Image" />
      <span className="hidden-xs">{fullname}</span>
    </DropdownToggle>
    <DropdownMenuStyled className="dropdown">
      <DropdownItem className="user-header">
        <img src="https://graph.facebook.com/100006945288953/picture?type=square" className="rounded-circle" alt="User Image" />
        <p>
          {fullname}
          <small>Member since {registrationDate.format('MMM. YYYY')}</small>
        </p>
      </DropdownItem>
    </DropdownMenuStyled>
  </UncontrolledDropdownStyled>
);

const AdminTopbarComponent = ({ companyName, logo }) => (
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
          <AdminTopbarProfileComponent
            fullname="Vo Hoai Son"
            registrationDate={moment()}
          />
        </Nav>
      </NavItemStyled>
    </NavbarStyled>
  </header>
);

export default AdminTopbarComponent;