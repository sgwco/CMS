import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Breadcrumb, BreadcrumbItem, Button, Badge, Alert } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import { roleCapabilities, ALERT_STATUS } from '../../../../commons/enum';
import styles from './admin-content-roles.css';

class AdminContentRolesComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alertVisible: ALERT_STATUS.HIDDEN
    };
  }
  fetchRoles = gql`
    {
      roles {
        id
        name
        accessPermission
      }
    }
  `;

  removeRole = gql`
    mutation removeRole($id: ID!) {
      removeRole(id: $id)
    }
  `;

  accessPermissionFormatter = (cell) => {
    const roleLists = Object.keys(roleCapabilities);
    const badges = [];
    for (let index = 0; index < roleLists.length; index += 1) {
      if (cell & roleCapabilities[roleLists[index]].value) {
        badges.push(<Badge className={styles.roleBadge} color="success" key={index}>{roleCapabilities[roleLists[index]].title}</Badge>);
      }
    }
    return badges;
  }

  functionFormatter = (cell, row) => {
    return (
      <div className={styles.functionBtn}>
        <Button color="warning">
          <FontAwesome icon='edit' className="text-white" />
        </Button>
        <Button color="danger" onClick={() => this.onRemoveRole(row.id)}>
          <FontAwesome icon='trash' className="text-white" />
        </Button>
      </div>
    );
  }

  tableHeaders = [
    { text: 'Name', dataField: 'name', headerClasses: 'fit' },
    { text: 'Allowed Permission', dataField: 'accessPermission', formatter: this.accessPermissionFormatter },
    { text: 'Function', dataField: '', headerClasses: styles.functionColumn, formatter: this.functionFormatter }
  ];

  onDismissAlert = () => this.setState({ alertVisible: ALERT_STATUS.HIDDEN });
  triggerErrorCallback = () => this.setState({ alertVisible: ALERT_STATUS.ERROR });
  triggerSuccessCallback = () => this.setState({ alertVisible: ALERT_STATUS.SUCCESS });

  onRemoveRole = (id) => {
    const result = confirm('Do you want to remove this role?');
    if (result) {
      this.removeRoleMutation({ variables: { id } });
    }
  }

  updateRemoveRoleCache = (cache, { data: { removeRole } }) => {
    let { roles } = cache.readQuery({ query: this.fetchRoles });
    roles = roles.filter(item => item.id !== removeRole);
    cache.writeQuery({ query: this.fetchRoles, data: { roles } });
  }

  render() {
    const { match } = this.props;
    return (
      <Mutation
        mutation={this.removeRole}
        onError={this.triggerErrorCallback}
        onCompleted={this.triggerSuccessCallback}
        update={this.updateRemoveRoleCache}
      >
        {(removeRole, { error }) => {
          this.removeRoleMutation = removeRole;
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
                <Alert color="warning" isOpen={this.state.alertVisible === ALERT_STATUS.ERROR} toggle={this.onDismissAlert}>
                  Error: {error && error.graphQLErrors.length > 0 && error.graphQLErrors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.state.alertVisible === ALERT_STATUS.SUCCESS} toggle={this.onDismissAlert}>
                  Remove successfully!
                </Alert>
                <div className="box">
                  <div className="box-header">
                    <div className="box-title">List Roles</div>
                  </div>
                  <div className={[styles.boxCategories, 'box-body'].join(' ')}>
                    <Query query={this.fetchRoles}>
                      {({ loading, error, data }) => {
                        if (loading) return 'Loading...';
                        if (error) return `Error! ${error.message}`;
                        
                        return (
                          <BootstrapTable
                            keyField='id'
                            data={data.roles}
                            columns={this.tableHeaders}
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
        }}
      </Mutation>
    );
  }
}

export default withRouter(AdminContentRolesComponent);