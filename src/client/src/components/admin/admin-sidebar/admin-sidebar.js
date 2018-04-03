import React from 'react';
import { Button, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';

import AdminSidebarMenuComponent from './admin-sidebar-menu/admin-sidebar-menu';
import styles from './admin-sidebar.css';

const data = [
  {
    header: 'MAIN NAVIGATION',
    menus: [
      {
        title: 'Dashboard',
        href: 'dashboard',
        icon: 'tachometer-alt'
      }
    ]
  },
  {
    header: 'MANAGEMENT',
    menus: [
      {
        title: 'Posts',
        href: 'post',
        icon: 'file'
      },
      {
        title: 'Products',
        href: 'product',
        icon: 'shopping-cart',
        badgePrimary: '4'
      },
      {
        title: 'Users',
        href: 'user',
        icon: 'user'
      }
    ]
  },
  {
    header: 'CONFIGURATIONS',
    menus: [
      {
        title: 'Roles',
        href: 'role',
        icon: 'users'
      }
    ]
  }
];

export default class AdminSidebarComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeMenu: 'dashboard'
    };
  }

  selectMenu = (event) => {
    event.preventDefault();
    const menu = event.currentTarget.dataset['menu'];
    if (menu) {
      this.setState({ activeMenu: menu });
    }
  }

  renderMenu = (item, index) => {
    return (
      <AdminSidebarMenuComponent
        key={index}
        isActive={this.state.activeMenu === item.href}
        title={item.title}
        href={item.href}
        icon={item.icon}
        badgePrimary={item.badgePrimary}
        onClick={this.selectMenu}
      />
    );
  }

  renderMenuHeader = (item, index) => {
    return [
      <li key={index} className="header">{item.header}</li>,
      item.menus.map(this.renderMenu)
    ];
  }

  render() {
    return (
      <aside className="main-sidebar">
        <section className="sidebar">
          <div className="user-panel">
            <div className="float-left image">
              <img src="https://graph.facebook.com/100006945288953/picture?type=square" className="rounded-circle" alt="User Image" />
            </div>
            <div className="float-left info">
              <p>Vo Hoai Son</p>
              <a href="#">Super Admin</a>
            </div>
          </div>
          <form action="#" method="get" className="sidebar-form">
            <InputGroup>
              <Input type="text" name="q" className={styles.search} placeholder="Search..." />
              <InputGroupAddon addonType='append'>
                <Button className="btn-flat" type="submit" name="search" id="search-btn">
                  <FontAwesome icon='search' />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </form>
          <ul className="sidebar-menu" data-widget="tree">
            {data.map(this.renderMenuHeader)}
          </ul>
        </section>
      </aside>
    );
  }
}