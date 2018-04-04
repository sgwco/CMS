import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Breadcrumb, BreadcrumbItem, Row, Col, Form, Input, FormGroup, Label, Button, Alert } from 'reactstrap';

import { roleCapabilities, ALERT_STATUS } from '../../../../commons/enum';
import styles from './admin-content-roles-form.css';

class AdminContentRolesFormComponent extends React.Component {
  static propTypes = {
    isEditedUser: PropTypes.bool
  }

  static defaultProps = {
    isEditedUser: false
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

  createRole = gql`
    mutation createRole($name: String!, $accessPermission: Int!) {
      createRole(name: $name, accessPermission: $accessPermission) {
        id
        name
        accessPermission
      }
    }
  `;

  getRoleById = gql`
    query role($id: ID!) {
      role(id: $id) {
        id
        name
        accessPermission
      }
    }
  `;

  listRoles = Object.keys(roleCapabilities);

  constructor(props) {
    super(props);

    this.state = {
      roleName: '',
      roleCapabilities: {},
      alertVisible: ALERT_STATUS.HIDDEN,
      checkboxSelectAll: false,
    };
  }

  async componentWillMount() {
    const { isEditedUser, client, match, history } = this.props;
    if (isEditedUser) {
      try {
        const { data } = await client.query({
          query: this.getRoleById,
          variables: { id: match.params.id }
        });
        const roles = {};
        let checkboxSelectAll = false;

        for (let index = 0; index < this.listRoles.length; index += 1) {
          if (this.checkRoleAllowed(data.role.accessPermission, roleCapabilities[this.listRoles[index]].value)) {
            roles[this.listRoles[index]] = true;
          }
        }

        if (Object.keys(roles).length === this.listRoles.length) {
          checkboxSelectAll = true;
        }

        this.setState({ roleName: data.role.name, roleCapabilities: roles, checkboxSelectAll });
      }
      catch (e) {
        history.push('/admin/role');
      }
    }
  }

  checkRoleAllowed = (permission, role) => {
    return permission & role;
  }

  renderTopTitle = () => this.props.isEditedUser ? 'Edit Role' : 'Add New Role';

  onDismissAlert = () => this.setState({ alertVisible: ALERT_STATUS.HIDDEN });
  triggerErrorCallback = () => this.setState({ alertVisible: ALERT_STATUS.ERROR });
  triggerSuccessCallback = () => this.setState({
    roleName: '',
    roleCapabilities: {},
    checkboxSelectAll: false,
    alertVisible: ALERT_STATUS.SUCCESS
  });
  
  selectRole = (event) => {
    const roleCapabilities = Object.assign({}, this.state.roleCapabilities);
    const { role } = event.target.dataset;
    const availableRoles = Object.keys(roleCapabilities);

    roleCapabilities[role] = roleCapabilities[role] ? !roleCapabilities[role] : true;
    const checkboxUnselectedRole = this.listRoles.findIndex(role => roleCapabilities[role] === false);

    this.setState({
      roleCapabilities,
      checkboxSelectAll: checkboxUnselectedRole === -1 && availableRoles.length === this.listRoles.length
    });
  }

  selectAllRoles = () => {
    const roleCapabilities = Object.assign({}, this.state.roleCapabilities);
    for (let index = 0; index < this.listRoles.length; index += 1) {
      roleCapabilities[this.listRoles[index]] = !this.state.checkboxSelectAll;
    }

    this.setState({ checkboxSelectAll: !this.state.checkboxSelectAll, roleCapabilities });
  }

  saveRole = async (createRole) => {
    let accessPermission = 0;
    for (let index = 0; index < this.listRoles.length; index += 1) {
      if (this.state.roleCapabilities[this.listRoles[index]])
        accessPermission += roleCapabilities[this.listRoles[index]].value;
    }
    createRole({ variables: { name: this.state.roleName, accessPermission }});
  }

  updateRoleCache = (cache, { data: { createRole } }) => {
    try {
      const { roles } = cache.readQuery({ query: this.fetchRoles });
      roles.push(createRole);
      cache.writeQuery({ query: this.fetchRoles, data: { roles } });
    }
    catch (e) {
      // Do nothing
    }
  }

  renderRole = (item, index) => {
    return (
      <Col key={index} md={4} sm={12}>
        <Label check>
          <Input
            type="checkbox"
            checked={this.state.roleCapabilities[item] === true}
            onClick={this.selectRole}
            data-role={item}
          />
          {roleCapabilities[item].title}
        </Label>
      </Col>
    );
  }

  render() {
    return (
      <Mutation
        mutation={this.createRole}
        onError={this.triggerErrorCallback}
        onCompleted={this.triggerSuccessCallback}
        update={this.updateRoleCache}
      >
        {(createRole, { error }) => (
          <Form onSubmit={e => { e.preventDefault(); this.saveRole(createRole); }}>
            <section className="content-header">
              <h1>
                {this.renderTopTitle()}
              </h1>
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to='/admin'><FontAwesome icon="home" /> Home</Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <Link to="/admin/role"><FontAwesome icon="users" /> Role</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>{this.renderTopTitle()}</BreadcrumbItem>
              </Breadcrumb>
            </section>
            <section className="content">
              <Alert color="warning" isOpen={this.state.alertVisible === ALERT_STATUS.ERROR} toggle={this.onDismissAlert}>
                Error: {error && error.graphQLErrors.length > 0 && error.graphQLErrors[0].message}
              </Alert>
              <Alert color="success" isOpen={this.state.alertVisible === ALERT_STATUS.SUCCESS} toggle={this.onDismissAlert}>
                Create new role successfully!
              </Alert>
              <div className="box box-primary">
                <div className="box-header">
                  <div className="box-title">Role Capabilities</div>
                </div>
                <div className={[styles.boxBasicInfo, 'box-body'].join(' ')}>
                  <Row>
                    <Col sm={{ size: 6, offset: 3 }}>
                      <FormGroup row>
                        <Label for="name" sm={3}>Role Name</Label>
                        <Col sm={9}>
                          <Input
                            type="text"
                            id="name"
                            placeholder="Username"
                            value={this.state.roleName}
                            onChange={(e) => this.setState({ roleName: e.target.value })}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={3}>Role Capabilities</Label>
                        <Col sm={9}>
                          <Row className={styles.rowSelectAll}>
                            <Col sm={12}>
                              <Label check>
                                <Input type="checkbox" checked={this.state.checkboxSelectAll} onClick={this.selectAllRoles} />
                                Select all
                              </Label>
                            </Col>
                          </Row>
                          <Row>
                            {this.listRoles.map(this.renderRole)}
                          </Row>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <div className="box-footer">
                  <Button color="primary" type="submit" className="float-right">Save</Button>
                </div>
              </div>
            </section>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default withApollo(AdminContentRolesFormComponent);