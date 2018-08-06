import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { Badge } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import _ from 'lodash';
import { compose, withHandlers, branch, renderComponent } from 'recompose';

const MenuLiStyled = styled.li.attrs({
  className: props => props.isActive ? 'active menu-open' : ''
})``;

const SubmenuLiStyled = styled.li.attrs({
  className: props => props.isActive ? 'active' : ''
})``;

const MenuIconStyled = styled(FontAwesome)`
  width: 20px !important;
`;

const MenuTitleStyled = styled.span`
  margin-left: 10px;
`;

const MenuItemSeparator = styled.li`
  margin-bottom: 15px !important;
`;

const AdminSidebarMenuComponent = ({ menuItem, match, isActiveMenu, isActiveSubmenu }) => (
  <MenuLiStyled className="treeview" isActive={isActiveMenu(menuItem.href)}>
    <Link to={`${match.url}${menuItem.href}`}>
      <MenuIconStyled icon={menuItem.icon} />
      <MenuTitleStyled>
        <FormattedMessage id={menuItem.title} />
      </MenuTitleStyled>
      {menuItem.badgePrimary && (
        <span className="pull-right-container">
          <Badge color='primary' className='float-right'>4</Badge>
        </span>
      )}
    </Link>
    {!_.isEmpty(menuItem.subMenu) && menuItem.subMenu.length > 0 && (
      <ul className="treeview-menu">
        {menuItem.subMenu.map((item, index) => (
          <SubmenuLiStyled key={index} isActive={isActiveSubmenu(item.href)}>
            <Link to={`${match.url}/${item.href}`}><FontAwesome icon="angle-right" /> {item.title}</Link>
          </SubmenuLiStyled>
        ))}
      </ul>
    )}
  </MenuLiStyled>
);

export default compose(
  branch(
    ({ menuItem }) => menuItem.separator,
    renderComponent(MenuItemSeparator)
  ),
  withRouter,
  withHandlers({
    isActiveSubmenu: ({ location }) => (href) => {
      const pathname = location.pathname.split('/');
      pathname.splice(0, 2);
      const parsedHref = pathname.join('/');
      
      return parsedHref === href;
    },
    isActiveMenu: ({ location }) => (href) => {
      const pathname = location.pathname.split('/');
      return pathname.indexOf(href) > -1;
    }
  })
)(AdminSidebarMenuComponent);