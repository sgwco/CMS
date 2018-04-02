import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

import styles from './admin-content-users.css';

const fetchUsers = gql`
  {
    users {
      id
      username
      fullname
      email
      registrationDate
      accessPermission
      userStatus
    }
  }
`;

const userStatusFilterEnum = {
  'ACTIVE': 'Active',
  'DEACTIVE': 'Deactive'
};

const tableHeaders = [
  { text: 'User Name', dataField: 'username', filter: textFilter({ delay: 0 }) },
  { text: 'Full Name', dataField: 'fullname', filter: textFilter({ delay: 0 }) },
  { text: 'Email', dataField: 'email', filter: textFilter({ delay: 0 }) },
  { text: 'Registration Date', dataField: 'registrationDate', formatter: (cell) => moment(cell).format('DD/MM/YYYY') },
  { text: 'Access Permission', dataField: 'accessPermission' },
  { text: 'User Status', dataField: 'userStatus', filter: selectFilter({ options: userStatusFilterEnum }), classes: styles.userStatusCell }
];

export default class AdminContentUsersComponent extends React.Component {
  render() {
    return (
      <div>
        <section className="content-header">
          <h1 className={styles.contentHeaderTitle}>
            <span>Users</span>
            <Button color="primary" size="sm">
              <FontAwesome icon="plus" /> Add new user
            </Button>
          </h1>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to='/admin'><FontAwesome icon="home" /> Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Users</BreadcrumbItem>
          </Breadcrumb>
        </section>
        <section className="content">
          <div className="box">
            <div className="box-header">
              <div className="box-title">List Users</div>
            </div>
            <div className={[styles.boxCategories, 'box-body'].join(' ')}>
              <Query query={fetchUsers}>
                {({ loading, error, data }) => {
                  if (loading) return 'Loading...';
                  if (error) return `Error! ${error.message}`;
                  
                  return (
                    <BootstrapTable
                      keyField='username'
                      data={data.users}
                      columns={tableHeaders}
                      filter={filterFactory()}
                      striped
                      hover
                    />
                  );
                }}
              </Query>
              
            </div>
          </div>
        </section>
      </div>
    );
  }
}