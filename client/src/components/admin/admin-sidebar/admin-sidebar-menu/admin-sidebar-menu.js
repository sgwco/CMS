import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';
import styles from './admin-sidebar-menu.css';

export default class AdminSidebarMenuComponent extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.string,
    badgePrimary: PropTypes.string,
    onClick: PropTypes.func
  }

  static defaultProps = {
    icon: null,
    badgePrimary: null,
    onClick: null
  }

  render() {
    const { isActive, title, badgePrimary, icon, onClick, href } = this.props;
    return (
      <li className={`treeview ${isActive && 'active'}`} data-menu={href} onClick={onClick}>
        <a href='#'>
          <FontAwesome icon={icon} className={styles.icon} />
          <span className={styles.title}>{title}</span>
          {badgePrimary && (
            <span className="pull-right-container">
              <Badge color='primary' className='float-right'>4</Badge>
            </span>
          )}
        </a>
      </li>
    );
  }
}