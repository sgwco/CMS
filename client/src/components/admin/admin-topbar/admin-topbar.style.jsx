import styled from 'styled-components';
import { Navbar, NavItem, UncontrolledDropdown, DropdownMenu } from 'reactstrap';

export const LogoImageStyled = styled.img`
  height: 80%;
`;

export const NavbarStyled = styled(Navbar)`
  padding: 0 !important;
`;

export const NavItemStyled = styled(NavItem)`
  list-style-type: none;
`;

export const UncontrolledDropdownStyled = styled(UncontrolledDropdown)`
  padding: 5px 15px;
`;

export const DropdownMenuStyled = styled(DropdownMenu)`
  border-radius: 0 !important;
  border: none !important;
`;