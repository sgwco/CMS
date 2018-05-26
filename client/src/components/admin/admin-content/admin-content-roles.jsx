import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Alert, Badge, Button } from 'reactstrap';
import styled from 'styled-components';
import { compose, withHandlers } from 'recompose';
import { TableHeaderColumn } from 'react-bootstrap-table';
import { FormattedMessage, injectIntl } from 'react-intl';

import { ALERT_STATUS, ROLE_CAPABILITIES } from '../../../utils/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
import { BoxWrapper, BoxBody } from '../../../shared/boxWrapper';
import {
  LoadingIndicator,
  ContentHeaderTitleStyled,
  MarginLeftButtonStyled,
  FunctionWrapperStyled,
  OpacityTextStyled,
  FunctionItem,
  BootstrapTableStyled
} from '../../../shared/components';
import { tablePaginationSetting } from '../../../config.json';

const AdminContentRolesComponent = ({
  match,
  alertVisible,
  removeAlert,
  alertContent,
  breadcrumbItems,
  getRoles: { roles = [] },
  accessPermissionFormatter,
  functionFormatter,
  intl
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <FormattedMessage id='categories.roles' />
        <Link to={`${match.url}/add-new`}>
          <MarginLeftButtonStyled color="primary" size="sm">
            <FontAwesome icon="plus" />{'  '}
            <FormattedMessage id='add_new' />
          </MarginLeftButtonStyled>
        </Link>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
        <FormattedMessage id={alertContent} />
      </Alert>
      <BoxWrapper color="primary" title={intl.messages['list']}>
        <BoxBody>
          <BootstrapTableStyled
            data={roles}
            options={tablePaginationSetting}
            pagination
            striped
            hover
          >
            <TableHeaderColumn
              dataField='name'
              isKey
              dataSort
              width='250'
              filter={{ type: 'TextFilter', delay: 1 }}
            >
              {intl.messages['fields.role_name']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='accessPermission'
              dataFormat={accessPermissionFormatter}
              tdStyle={{ whiteSpace: 'normal' }}
            >
              {intl.messages['fields.access_permission']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataFormat={functionFormatter}
              width='150'
            />
          </BootstrapTableStyled>
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
  injectIntl,
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

      const badgeWrapper = <div>{badges}</div>;
      return badges.length > 0 ? badgeWrapper : '—';
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
  })
)(AdminContentRolesComponent);