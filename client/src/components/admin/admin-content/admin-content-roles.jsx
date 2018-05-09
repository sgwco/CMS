import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Alert, Badge, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import styled from 'styled-components';
import { withProps, compose, withHandlers } from 'recompose';

import { ALERT_STATUS, ROLE_CAPABILITIES } from '../../../utils/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { BoxWrapper, BoxBody } from '../../../shared/boxWrapper';
import {
  LoadingIndicator,
  ContentHeaderTitleStyled,
  MarginLeftButtonStyled,
  FunctionWrapperStyled,
  OpacityTextStyled,
  FunctionItem
} from '../../../shared/components';

const AdminContentRolesComponent = ({
  match,
  alertVisible,
  removeAlert,
  alertContent,
  breadcrumbItems,
  tableHeaders,
  getRoles: { roles = [] },
  
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Roles</span>
        <Link to={`${match.url}/add-new`}>
          <MarginLeftButtonStyled color="primary" size="sm">
            <FontAwesome icon="plus" /> Add new role
          </MarginLeftButtonStyled>
        </Link>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
        {alertContent}
      </Alert>
      <BoxWrapper color="primary" title="List Roles">
        <BoxBody>
          <BootstrapTable
            keyField='id'
            data={roles}
            columns={tableHeaders}
            noDataIndication="Table is Empty"
            striped
            hover
          />
        </BoxBody>
      </BoxWrapper>
    </ContentBody>
  </ContentContainer>
);

const RoleBadgesStyled = styled(Badge)`
  margin-right: 5px;
  margin-bottom: 5px;
`;

export default compose(
  withRouter,
  withHandlers({
    nameFormatter: () => (cell, row) => {
      if (typeof row.id === 'number' && row.id < 0) {
        cell = (<OpacityTextStyled>{cell}</OpacityTextStyled>);
      }

      return cell;
    },
    accessPermissionFormatter: () => (cell, row) => {
      const roleLists = Object.keys(ROLE_CAPABILITIES);
      const badges = [];
      for (let index = 0; index < roleLists.length; index += 1) {
        if (cell & ROLE_CAPABILITIES[roleLists[index]].value) {
          badges.push(<RoleBadgesStyled color="success" key={index}>{ROLE_CAPABILITIES[roleLists[index]].title}</RoleBadgesStyled>);
        }
      }

      if (typeof row.id === 'number' && row.id < 0) {
        const opacityText = (<OpacityTextStyled>{badges}</OpacityTextStyled>);
        return opacityText;
      }

      return badges.length > 0 ? badges : '—';
    },
    functionFormatter: ({ match, onRemoveRole, getUserToken: { loggedInUser = {} } }) => (cell, row) => {
      let functionCell = null;
      functionCell = (
        <FunctionWrapperStyled>
          <LoadingIndicator />
        </FunctionWrapperStyled>
      );
      if (typeof row.id === 'number' && row.id < 0) {
        functionCell = (
          <FunctionWrapperStyled>
            <LoadingIndicator />
          </FunctionWrapperStyled>
        );
      }
      else {
        functionCell = (
          <FunctionWrapperStyled>
            <FunctionItem>
              <Link to={`${match.url}/edit/${row.id}`}>
                <Button color="warning">
                  <FontAwesome icon='edit' className="text-white" />
                </Button>
              </Link>
            </FunctionItem>
            {(loggedInUser.role || {}).name !== row.name && (
              <FunctionItem>
                <Button color="danger" onClick={() => onRemoveRole(row.id)}>
                  <FontAwesome icon='trash' className="text-white" />
                </Button>
              </FunctionItem>
            )}
          </FunctionWrapperStyled>
        );
      }
      
      return functionCell;
    }
  }),
  withProps(({ accessPermissionFormatter, functionFormatter, nameFormatter }) => ({
    tableHeaders: [
      { text: 'Name', dataField: 'name', headerClasses: 'fit', formatter: nameFormatter },
      { text: 'Allowed Permission', dataField: 'accessPermission', formatter: accessPermissionFormatter },
      { text: 'Function', dataField: '', headerClasses: 'function-column', formatter: functionFormatter }
    ]
  }))
)(AdminContentRolesComponent);