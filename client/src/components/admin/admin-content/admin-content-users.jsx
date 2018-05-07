import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Breadcrumb, BreadcrumbItem, Alert, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { compose, withHandlers, withProps } from 'recompose';

import { ALERT_STATUS } from '../../../utils/enum';
import { BoxWrapper, BoxBody } from '../../../shared/boxWrapper';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { ContentHeaderTitleStyled, MarginLeftButtonStyled, FunctionWrapperStyled, LoadingIndicator, FunctionItem } from '../../../shared/components';

const userStatusFilterEnum = {
  'ACTIVE': 'Active',
  'DEACTIVE': 'Deactive'
};

const AdminContentUsersComponent = ({
  match,
  breadcrumbItems,
  alertVisible,
  removeAlert,
  alertContent,
  tableHeaders,
  getUsers: { users = [] }
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
            columns={tableHeaders}
            filter={filterFactory()}
            noDataIndication="Table is Empty"
            striped
            hover
          />
        </BoxBody>
      </BoxWrapper>
    </ContentBody>
  </ContentContainer>
);

export default compose(
  withRouter,
  withHandlers({
    functionFormatter: ({ onRemoveUser, match, getUserToken: { loggedInUser = {} } }) => (cell, row) => {
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
    }
  }),
  withProps(({ functionFormatter }) => ({
    tableHeaders: [
      { text: 'User Name', dataField: 'username', filter: textFilter({ delay: 0 }) },
      { text: 'Full Name', dataField: 'fullname', filter: textFilter({ delay: 0 }), formatter: cell => cell || '—' },
      { text: 'Email', dataField: 'email', filter: textFilter({ delay: 0 }), formatter: cell => cell || '—' },
      { text: 'Registration Date', dataField: 'registrationDate', formatter: (cell) => moment(cell).format('DD/MM/YYYY') },
      { text: 'Role', dataField: 'role.name' },
      { text: 'User Status', dataField: 'userStatus', filter: selectFilter({ options: userStatusFilterEnum }), classes: 'user-status-cell' },
      { text: 'Function', dataField: '', headerClasses: 'function-column', formatter: functionFormatter }
    ]
  }))
)(AdminContentUsersComponent);