import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import styles from './admin-content-roles.css';

const fetchUsers = gql`
  {
    roles {
      id
      name
      accessPermission
    }
  }
`;

const tableHeaders = [
  { text: 'Name', dataField: 'name', filter: textFilter({ delay: 0 }) },
  { text: 'Access Permission', dataField: 'accessPermission', filter: textFilter({ delay: 0 }) }
];

class AdminContentRolesComponent extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <section className="content-header">
          <h1 className={styles.contentHeaderTitle}>
            <span>Roles</span>
            <Link to={`${match.url}/add-new`}>
              <Button color="primary" size="sm">
                <FontAwesome icon="plus" /> Add new role
              </Button>
            </Link>
          </h1>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to='/admin'><FontAwesome icon="home" /> Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Roles</BreadcrumbItem>
          </Breadcrumb>
        </section>
        <section className="content">
          <div className="box">
            <div className="box-header">
              <div className="box-title">List Roles</div>
            </div>
            <div className={[styles.boxCategories, 'box-body'].join(' ')}>
              <Query query={fetchUsers}>
                {({ loading, error, data }) => {
                  if (loading) return 'Loading...';
                  if (error) return `Error! ${error.message}`;
                  
                  return (
                    <BootstrapTable
                      keyField='username'
                      data={data.roles}
                      columns={tableHeaders}
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

export default withRouter(AdminContentRolesComponent);