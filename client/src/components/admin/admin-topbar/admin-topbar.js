import React from 'react';
import { Navbar, Nav, NavItem } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/fontawesome-free-solid';
import logo from '../../../assets/img/logo.png';
import AdminTopbarProfileComponent from './admin-topbar-profile/admin-topbar-profile';
import styles from './admin-topbar.css';

export default class AdminTopbarComponent extends React.Component {
  render() {
    return (
      <header className="main-header">
        <a href="index2.html" className="logo">
          <span className="logo-mini">
            <img src={logo} alt="logo" className={[styles.logoImgMini, 'logo-img-mini'].join(' ')} />
          </span>
          <span className="logo-lg">
            <img src={logo} alt="logo" className={[styles.logoImgLg, 'logo-img-lg'].join(' ')} /> Sai Gon Web
          </span>
        </a>
        <Navbar className={[styles.navbar, 'navbar-static-top'].join(' ')}>
          <NavItem className={styles.navItem}>
            <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
              <FontAwesome icon={faBars} />
            </a>
          </NavItem>
          <NavItem className={[styles.navItem, 'navbar-custom-menu'].join(' ')}>
            <Nav navbar className="nav">
              <AdminTopbarProfileComponent />
            </Nav>
          </NavItem>
        </Navbar>
      </header>
    );
  }
}