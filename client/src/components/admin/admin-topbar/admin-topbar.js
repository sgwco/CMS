import React from 'react';
import { Navbar, Nav, NavItem } from 'reactstrap';
import logo from '../../../assets/img/logo.png';

import AdminTopbarProfileComponent from './admin-topbar-profile/admin-topbar-profile';

import './admin-topbar.css';

export default class AdminTopbarComponent extends React.Component {
  render() {
    return (
      <header class="main-header">
        <a href="index2.html" class="logo">
          <span class="logo-mini">
            <img src={logo} alt="logo" class="logo-img-mini" />
          </span>
          <span class="logo-lg">
            <img src={logo} alt="logo" class="logo-img-lg" /> Sai Gon Web
          </span>
        </a>
        <Navbar className="navbar-static-top">
          <NavItem>
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
              <i class="fas fa-bars"></i>
            </a>
          </NavItem>
          <NavItem className="navbar-custom-menu">
            <Nav navbar>
              <AdminTopbarProfileComponent />
            </Nav>
          </NavItem>
        </Navbar>
        {/* <nav class="navbar navbar-static-top">
          
          <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
              <li class="dropdown user user-menu">
                <AdminTopbarProfileComponent />
              </li>
            </ul>
          </div>
        </nav> */}
      </header>
    );
  }
}