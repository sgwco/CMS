import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Badge } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { compose, setPropTypes, defaultProps } from 'recompose';

const AdminSidebarMenuComponent = ({ isActive, title, href, icon, badgePrimary, onClick, match }) => (
  <MenuLiStyled className="treeview" isActive={isActive} onClick={onClick}>
    <Link to={`${match.url}/${href}`}>
      <MenuIconStyled icon={icon} />
      <MenuTitleStyled>{title}</MenuTitleStyled>
      {badgePrimary && (
        <span className="pull-right-container">
          <Badge color='primary' className='float-right'>4</Badge>
        </span>
      )}
    </Link>
  </MenuLiStyled>
);

const MenuLiStyled = styled.li.attrs({
  className: props => props.isActive ? 'active' : ''
})``;

const MenuIconStyled = styled(FontAwesome)`
  width: 20px !important;
`;

const MenuTitleStyled = styled.span`
  margin-left: 10px;
`;

export default compose(
  withRouter,
  setPropTypes({
    isActive: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.string,
    badgePrimary: PropTypes.string,
    onClick: PropTypes.func
  }),
  defaultProps({
    icon: null,
    badgePrimary: null,
    onClick: null
  })
)(AdminSidebarMenuComponent);