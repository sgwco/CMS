import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Breadcrumb, BreadcrumbItem, Form, Input } from 'reactstrap';

import { DataTable } from '../../../../commons/dataTable';
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

const tableHeaders = [
  { title: 'User Name', value: 'username' },
  { title: 'Full Name', value: 'fullname' },
  { title: 'Email', value: 'email' },
  { title: 'Registration Date', value: 'registrationDate' },
  { title: 'Access Permission', value: 'accessPermission' },
  { title: 'User Status', value: 'userStatus' }
];

export default class AdminContentUsersComponent extends React.Component {
  render() {
    return (
      <div>
        <section className="content-header">
          <h1>Users</h1>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to='/admin'><FontAwesome icon="home" /> Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Users</BreadcrumbItem>
          </Breadcrumb>
        </section>
        <section className="content">
          <Form className={styles.filterSection} inline>
            <span>Tìm kiếm theo</span>
            <Input type="select" className={styles.marginInput}>
              <option value="">-- Vai trò --</option>
              <option value="admin">Admin</option>
              <option value="khachhang">Khách hàng</option>
            </Input>
          </Form>
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
                    <DataTable striped bordered hover isLoading={loading} headers={tableHeaders} data={data.users} />
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