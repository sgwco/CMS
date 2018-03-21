import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import './admin-topbar-profile.css';

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
      <Dropdown className="user user-menu" styleName="user-menu" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav caret>
          <img src="https://graph.facebook.com/100006945288953/picture?type=square" class="user-image" alt="User Image" />
          <span class="hidden-xs">Vo Hoai Son</span>
        </DropdownToggle>
        <DropdownMenu>
          <li className="user-header">
            <img src="https://graph.facebook.com/100006945288953/picture?type=square" class="img-circle" alt="User Image" />
            <p>
              Vo Hoai Son - Web Developer
              <small>Member since Nov. 2012</small>
            </p>
          </li>
        </DropdownMenu>
      </Dropdown>
    );
  }
}