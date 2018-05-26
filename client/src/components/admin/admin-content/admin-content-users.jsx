import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Alert, Button, Modal, ModalBody, ModalHeader, Badge } from 'reactstrap';
import { TableHeaderColumn } from 'react-bootstrap-table';
import { compose, withHandlers } from 'recompose';

import Breadcrumb from '../../../shared/breadcrumb';
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
  rolesFilter,
  intl
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <FormattedMessage id='categories.users' />
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
      <BoxWrapper color="primary" title={<FormattedMessage id='list' />}>
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
              {intl.messages['fields.username']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='fullname'
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
              dataFormat={nothingFormatted}
            >
              {intl.messages['fields.fullname']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='email'
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
              dataFormat={nothingFormatted}
            >
              {intl.messages['fields.email']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='registrationDate'
              dataSort
              dataFormat={cell => moment(cell).format('DD/MM/YYYY')}
            >
              {intl.messages['fields.register_date']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='role'
              filter={{ type: 'SelectFilter', options: rolesFilter() }}
            >
              {intl.messages['fields.role']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='userStatus'
              filter={{ type: 'SelectFilter', options: uppercaseObjectValue(USER_STATUS) }}
              dataFormat={userStatusFormatter}
            >
              {intl.messages['fields.status']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataFormat={functionFormatter}
              width='200'
            />
          </BootstrapTableStyled>
          {detailModalVisible && (
            <Modal isOpen={detailModalVisible} toggle={() => toggleDetailModal()} size="lg">
              <ModalHeader toggle={() => toggleDetailModal()}>
                <FormattedMessage id='package_detail' />
              </ModalHeader>
              <ModalBody>
                <CardViewListStyled color='#e74c3c' icon='user' label={intl.messages['fields.username']}>
                  {selectedUser.username + (selectedUser.fullname && ` (${selectedUser.fullname})`)}
                </CardViewListStyled>
                {selectedUser.phone && (
                  <CardViewListStyled color='#00b894' icon='phone' label={intl.messages['fields.phone']}>
                    {selectedUser.phone}
                  </CardViewListStyled>
                )}
                {selectedUser.email && (
                  <CardViewListStyled color='#fd79a8' icon='envelope' label={intl.messages['fields.email']}>
                    <a href={`mailto:${selectedUser.email}`}>{selectedUser.email}</a>
                  </CardViewListStyled>
                )}
                {selectedUser.registrationDate && (
                  <CardViewListStyled color='#6c5ce7' icon='calendar' label={intl.messages['fields.register_date']}>
                    {moment(selectedUser.registrationDate).format('DD/MM/YYYY')}
                  </CardViewListStyled>
                )}
                {selectedUser.address && (
                  <CardViewListStyled color='#e056fd' icon='location-arrow' label={intl.messages['fields.address']}>
                    {selectedUser.address}
                  </CardViewListStyled>
                )}
                {selectedUser.role && (
                  <CardViewListStyled color='#ff7979' icon='address-card' label={intl.messages['fields.role']}>
                    {selectedUser.role}
                  </CardViewListStyled>
                )}
                {selectedUser.userMeta && [
                  <CardViewListStyled color='#6ab04c' icon='id-card' label={intl.messages['fields.identity_card']} key={1}>
                    {selectedUser.userMeta.find(item => item.metaKey === 'identityCard').metaValue}
                  </CardViewListStyled>,
                  <CardViewListStyled color='#7ed6df' icon='university' label={intl.messages['fields.banking']} key={2}>
                    <div>
                      <FormattedMessage id='fields.banking' />{': '}
                      <strong>{selectedUser.userMeta.find(item => item.metaKey === 'banking').metaValue || 'Unknown'}</strong>
                    </div>
                    <div>
                      <FormattedMessage id='fields.banking_number' />{': '}
                      <strong>{selectedUser.userMeta.find(item => item.metaKey === 'bankingNumber').metaValue || 'Unknown'}</strong>
                    </div>
                    <div>
                      <FormattedMessage id='fields.banking_owner' />{': '}
                      <strong>{selectedUser.userMeta.find(item => item.metaKey === 'bankingOwner').metaValue || 'Unknown'}</strong>
                    </div>
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
  injectIntl,
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
      const cellFormatted = <FormattedMessage id={`package_status.${_.toLower(cell)}`} />;
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