import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import styles from './admin-topbar-profile.css';

export default class AdminTopbarProfileComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  render() {
    return (
      <UncontrolledDropdown className={[styles.userMenu, 'user user-menu'].join(' ')} nav inNavbar>
        <DropdownToggle nav caret>
          <img src="https://graph.facebook.com/100006945288953/picture?type=square" className="user-image" alt="User Image" />
          <span className="hidden-xs">Vo Hoai Son</span>
        </DropdownToggle>
        <DropdownMenu className={styles.dropdown}>
          <DropdownItem className="user-header">
            <img src="https://graph.facebook.com/100006945288953/picture?type=square" className="rounded-circle" alt="User Image" />
            <p>
              Vo Hoai Son - Web Developer
              <small>Member since Nov. 2012</small>
            </p>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}