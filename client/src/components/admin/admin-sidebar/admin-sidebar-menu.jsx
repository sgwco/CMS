import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Badge } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { compose, withHandlers } from 'recompose';

const AdminSidebarMenuComponent = ({ title, href, icon, badgePrimary, onClick, match, subMenu = [], isActiveMenu, isActiveSubmenu }) => (
  <MenuLiStyled className="treeview" isActive={isActiveMenu(href)} onClick={onClick}>
    <Link to={`${match.url}/${href}`}>
      <MenuIconStyled icon={icon} />
      <MenuTitleStyled>{title}</MenuTitleStyled>
      {badgePrimary && (
        <span className="pull-right-container">
          <Badge color='primary' className='float-right'>4</Badge>
        </span>
      )}
    </Link>
    {subMenu.length > 0 && (
      <ul className="treeview-menu">
        {subMenu.map((item, index) => (
          <SubmenuLiStyled key={index} isActive={isActiveSubmenu(item.href)}>
            <Link to={`${match.url}/${item.href}`}><FontAwesome icon="angle-right" /> {item.title}</Link>
          </SubmenuLiStyled>
        ))}
      </ul>
    )}
  </MenuLiStyled>
);

export default compose(
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

