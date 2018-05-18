import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Breadcrumb, BreadcrumbItem, Alert, Button, Modal, ModalBody, ModalHeader, Badge } from 'reactstrap';
import { TableHeaderColumn } from 'react-bootstrap-table';
import { compose, withHandlers } from 'recompose';

import { ALERT_STATUS, USER_STATUS } from '../../../utils/enum';
import { uppercaseObjectValue } from '../../../utils/utils';
import { BoxWrapper, BoxBody } from '../../../shared/boxWrapper';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
import {
  ContentHeaderTitleStyled,
  MarginLeftButtonStyled,
  FunctionWrapperStyled,
  LoadingIndicator,
  FunctionItem,
  CardViewListStyled,
  BootstrapTableStyled
} from '../../../shared/components';
import { tablePaginationSetting } from '../../../config.json';

const AdminContentUsersComponent = ({
  match,
  breadcrumbItems,
  alertVisible,
  removeAlert,
  alertContent,
  usersNormalizer,
  detailModalVisible,
  toggleDetailModal,
  selectedUser,
  functionFormatter,
  nothingFormatted,
  userStatusFormatter,
  rolesFilter
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Users</span>
        <Link to={`${match.url}/add-new`}>
          <MarginLeftButtonStyled color="primary" size="sm">
            <FontAwesome icon="plus" /> Add new user
          </MarginLeftButtonStyled>
        </Link>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to='/admin'><FontAwesome icon="home" /> Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>Users</BreadcrumbItem>
      </Breadcrumb>
    </ContentHeader>
    <ContentBody>
      <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
        {alertContent}
      </Alert>
      <BoxWrapper color="primary" title="List Users">
        <BoxBody>
          <BootstrapTableStyled
            data={usersNormalizer()}
            options={tablePaginationSetting}
            pagination
            striped
            hover
          >
            <TableHeaderColumn
              dataField='username'
              isKey
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
            >
              Username
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='fullname'
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
              dataFormat={nothingFormatted}
            >
              Fullname
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='email'
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
              dataFormat={nothingFormatted}
            >
              Email
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='registrationDate'
              dataSort
              dataFormat={cell => moment(cell).format('DD/MM/YYYY')}
            >
              Register Date
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='role'
              filter={{ type: 'SelectFilter', options: rolesFilter() }}
            >
              Role
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='userStatus'
              filter={{ type: 'SelectFilter', options: uppercaseObjectValue(USER_STATUS) }}
              dataFormat={userStatusFormatter}
            >
              User Status
            </TableHeaderColumn>
            <TableHeaderColumn
              dataFormat={functionFormatter}
              width='200'
            />
          </BootstrapTableStyled>
          {detailModalVisible && (
            <Modal isOpen={detailModalVisible} toggle={() => toggleDetailModal()} size="lg">
              <ModalHeader toggle={() => toggleDetailModal()}>Package detail</ModalHeader>
              <ModalBody>
                <CardViewListStyled color='#e74c3c' icon='user' label='User'>
                  {selectedUser.username + (selectedUser.fullname && ` (${selectedUser.fullname})`)}
                </CardViewListStyled>
                {selectedUser.phone && (
                  <CardViewListStyled color='#00b894' icon='phone' label='Phone'>
                    {selectedUser.phone}
                  </CardViewListStyled>
                )}
                {selectedUser.email && (
                  <CardViewListStyled color='#fd79a8' icon='envelope' label='Email'>
                    <a href={`mailto:${selectedUser.email}`}>{selectedUser.email}</a>
                  </CardViewListStyled>
                )}
                {selectedUser.registrationDate && (
                  <CardViewListStyled color='#6c5ce7' icon='calendar' label='Registered Date'>
                    {moment(selectedUser.registrationDate).format('DD/MM/YYYY')}
                  </CardViewListStyled>
                )}
                {selectedUser.address && (
                  <CardViewListStyled color='#e056fd' icon='location-arrow' label='Address'>
                    {selectedUser.address}
                  </CardViewListStyled>
                )}
                {selectedUser.role && (
                  <CardViewListStyled color='#ff7979' icon='address-card' label='Role'>
                    {selectedUser.role}
                  </CardViewListStyled>
                )}
                {selectedUser.userMeta && [
                  <CardViewListStyled color='#6ab04c' icon='id-card' label='Identity Card' key={1}>
                    {selectedUser.userMeta.find(item => item.metaKey === 'identityCard').metaValue}
                  </CardViewListStyled>,
                  <CardViewListStyled color='#7ed6df' icon='university' label='Banking' key={2}>
                    <div>Banking: <strong>{selectedUser.userMeta.find(item => item.metaKey === 'banking').metaValue || 'Unknown'}</strong></div>
                    <div>Number: <strong>{selectedUser.userMeta.find(item => item.metaKey === 'bankingNumber').metaValue || 'Unknown'}</strong></div>
                    <div>Owner: <strong>{selectedUser.userMeta.find(item => item.metaKey === 'bankingOwner').metaValue || 'Unknown'}</strong></div>
                  </CardViewListStyled>
                ]}
              </ModalBody>
            </Modal>
          )}
        </BoxBody>
      </BoxWrapper>
    </ContentBody>
  </ContentContainer>
);

export default compose(
  withRouter,
  withHandlers({
    functionFormatter: ({ onRemoveUser, match, getUserToken: { loggedInUser = {} }, toggleDetailModal }) => (cell, row) => {
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
              <Button color="info" onClick={() => toggleDetailModal(row)}>
                <FontAwesome icon='eye' />
              </Button>
            </FunctionItem>
            <FunctionItem>
              <Link to={`${match.url}/edit/${row.id}`}>
                <Button color="warning">
                  <FontAwesome icon='edit' className="text-white" />
                </Button>
              </Link>
            </FunctionItem>
            {loggedInUser.username !== row.username && (
              <FunctionItem>
                <Button color="danger" onClick={() => onRemoveUser(row.id)}>
                  <FontAwesome icon='trash' className="text-white" />
                </Button>
              </FunctionItem>
            )}
          </FunctionWrapperStyled>
        );
      }
      
      return functionCell;
    },
    userStatusFormatter: () => cell => {
      const cellFormatted = _.startCase(_.toLower(cell));
      const COLOR_TYPE = {
        ACTIVE: 'success',
        DEACTIVE: 'secondary'
      };
      const badge = <h4><Badge color={COLOR_TYPE[cell]}>{cellFormatted}</Badge></h4>;
      return badge;
    },
    nothingFormatted: () => cell => cell || '—',
    rolesFilter: ({ getRoles: { roles = [] } }) => () => roles.length > 0 ? Object.assign(...roles.map(item => ({ [item.name]: item.name }))) : {}
  })
)(AdminContentUsersComponent);