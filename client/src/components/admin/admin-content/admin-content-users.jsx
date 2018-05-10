import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Breadcrumb, BreadcrumbItem, Alert, Button, Modal, ModalBody, ModalHeader, Badge } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { compose, withHandlers, withProps } from 'recompose';

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
  CardViewListStyled
} from '../../../shared/components';
import { tablePaginationSetting } from '../../../config.json';

const AdminContentUsersComponent = ({
  match,
  breadcrumbItems,
  alertVisible,
  removeAlert,
  alertContent,
  tableHeaders,
  getUsers: { users = [] },
  detailModalVisible,
  toggleDetailModal,
  selectedUser
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
          <BootstrapTable
            keyField='username'
            data={users}
            pagination={paginationFactory(tablePaginationSetting)}
            columns={tableHeaders}
            filter={filterFactory()}
            noDataIndication="Table is Empty"
            striped
            hover
          />
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
                    {selectedUser.role.name}
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
    }
  }),
  withProps(({ functionFormatter, userStatusFormatter }) => ({
    tableHeaders: [
      { text: 'User Name', dataField: 'username', filter: textFilter({ delay: 0 }) },
      { text: 'Full Name', dataField: 'fullname', filter: textFilter({ delay: 0 }), formatter: cell => cell || '—' },
      { text: 'Email', dataField: 'email', filter: textFilter({ delay: 0 }), formatter: cell => cell || '—' },
      { text: 'Registration Date', dataField: 'registrationDate', formatter: (cell) => moment(cell).format('DD/MM/YYYY') },
      { text: 'Role', dataField: 'role.name' },
      { text: 'User Status', dataField: 'userStatus', filter: selectFilter({ options: uppercaseObjectValue(USER_STATUS) }), formatter: userStatusFormatter, classes: 'user-status-cell' },
      { text: 'Function', dataField: '', headerClasses: 'function-column', formatter: functionFormatter }
    ]
  }))
)(AdminContentUsersComponent);