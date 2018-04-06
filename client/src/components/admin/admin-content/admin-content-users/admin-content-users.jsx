import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Query, Mutation } from 'react-apollo';
import { Breadcrumb, BreadcrumbItem, Button, Alert } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

import { GET_FULL_USERS, REMOVE_USER } from '../../../../utils/graphql';
import { ALERT_STATUS } from '../../../../commons/enum';
import styles from './admin-content-users.css';
import { BoxWrapper, BoxBody } from '../../../../shared/boxWrapper';

const userStatusFilterEnum = {
  'ACTIVE': 'Active',
  'DEACTIVE': 'Deactive'
};

class AdminContentUsersComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alertVisible: ALERT_STATUS.HIDDEN
    };
  }

  functionFormatter = (cell, row) => {
    const { match } = this.props;
    return (
      <div className="function-btn">
        <Link to={`${match.url}/edit/${row.id}`}>
          <Button color="warning">
            <FontAwesome icon='edit' className="text-white" />
          </Button>
        </Link>
        <Button color="danger" data-id={row.id} onClick={this.removeUser}>
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

  onDismissAlert = () => this.setState({ alertVisible: ALERT_STATUS.HIDDEN });
  triggerErrorCallback = () => this.setState({ alertVisible: ALERT_STATUS.ERROR });
  triggerSuccessCallback = () => this.setState({ alertVisible: ALERT_STATUS.SUCCESS });

  removeUser = e => {
    const { id } = e.currentTarget.dataset;
    
    const result = confirm('Do you want to remove this user?');
    if (result) {
      this.removeUserMutation({
        variables: { id },
        optimisticResponse: {
          __typename: 'Mutation',
          removeUser: {
            __typename: 'String',
            id
          }
        },
        update(cache, { data: { removeUser } }) {
          let { users } = cache.readQuery({ query: GET_FULL_USERS });
          users = users.filter(item => item.id !== removeUser);
          cache.writeQuery({ query: GET_FULL_USERS, data: { users } });
        }
      });
    }
  }

  render() {
    const { match } = this.props;
    return (
      <Mutation
        mutation={REMOVE_USER}
        onError={this.triggerErrorCallback}
        onCompleted={this.triggerSuccessCallback}
      >
        {(removeUser, { error }) => {
          this.removeUserMutation = removeUser;
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
                <Alert color="warning" isOpen={this.state.alertVisible === ALERT_STATUS.ERROR} toggle={this.onDismissAlert}>
                  Error: {error && error.graphQLErrors.length > 0 && error.graphQLErrors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.state.alertVisible === ALERT_STATUS.SUCCESS} toggle={this.onDismissAlert}>
                  Remove successfully!
                </Alert>
                <BoxWrapper color="primary" title="List Users">
                  <BoxBody>
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
                  </BoxBody>
                </BoxWrapper>
              </section>
            </div>
          );
        }} 
      </Mutation>
    );
  }
}

export default withRouter(AdminContentUsersComponent);