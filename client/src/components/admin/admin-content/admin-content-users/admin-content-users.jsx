import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Query } from 'react-apollo';
import { Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

import { GET_FULL_USERS } from '../../../../utils/graphql';
import styles from './admin-content-users.css';

const userStatusFilterEnum = {
  'ACTIVE': 'Active',
  'DEACTIVE': 'Deactive'
};

class AdminContentUsersComponent extends React.Component {
  functionFormatter = (cell, row) => {
    const { match } = this.props;
    return (
      <div className="function-btn">
        <Link to={`${match.url}/edit/${row.id}`}>
          <Button color="warning">
            <FontAwesome icon='edit' className="text-white" />
          </Button>
        </Link>
        <Button color="danger" onClick={() => this.onRemoveRole(row.id)}>
          <FontAwesome icon='trash' className="text-white" />
        </Button>
      </div>
    );
  }

  tableHeaders = [
    { text: 'User Name', dataField: 'username', filter: textFilter({ delay: 0 }) },
    { text: 'Full Name', dataField: 'fullname', filter: textFilter({ delay: 0 }), formatter: cell => cell || '—' },
    { text: 'Email', dataField: 'email', filter: textFilter({ delay: 0 }) },
    { text: 'Registration Date', dataField: 'registrationDate', formatter: (cell) => moment(cell).format('DD/MM/YYYY') },
    { text: 'Role', dataField: 'role.name' },
    { text: 'User Status', dataField: 'userStatus', filter: selectFilter({ options: userStatusFilterEnum }), classes: styles.userStatusCell },
    { text: 'Function', dataField: '', headerClasses: 'function-column', formatter: this.functionFormatter }
  ];

  render() {
    const { match } = this.props;
    return (
      <div>
        <section className="content-header">
          <h1 className={styles.contentHeaderTitle}>
            <span>Users</span>
            <Link to={`${match.url}/add-new`}>
              <Button color="primary" size="sm">
                <FontAwesome icon="plus" /> Add new user
              </Button>
            </Link>
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
              <Query query={GET_FULL_USERS}>
                {({ loading, error, data }) => {
                  if (loading) return 'Loading...';
                  if (error) return `Error! ${error.message}`;
                  
                  return (
                    <BootstrapTable
                      keyField='username'
                      data={data.users}
                      columns={this.tableHeaders}
                      filter={filterFactory()}
                      noDataIndication="Table is Empty"
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

export default withRouter(AdminContentUsersComponent);