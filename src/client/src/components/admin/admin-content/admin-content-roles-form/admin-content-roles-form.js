import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Breadcrumb, BreadcrumbItem, Row, Col, Form, Input, FormGroup, Label, Button, Alert } from 'reactstrap';

import { roleCapabilities, ALERT_STATUS } from '../../../../commons/enum';
import styles from './admin-content-roles-form.css';

const createRole = gql`
  mutation createRole($name: String!, $accessPermission: Int!) {
    createRole(name: $name, accessPermission: $accessPermission) {
      id
    }
  }
`;

export default class AdminContentRolesFormComponent extends React.Component {
  static propTypes = {
    isEditedUser: PropTypes.bool
  }

  static defaultProps = {
    isEditedUser: false
  }

  constructor(props) {
    super(props);

    this.state = {
      roleName: '',
      roleCapabilities: {},
      alertVisible: ALERT_STATUS.HIDDEN
    };
  }

  renderTopTitle = () => this.props.isEditedUser ? 'Edit Role' : 'Add New Role';

  onDismissAlert = () => this.setState({ alertVisible: ALERT_STATUS.HIDDEN });
  triggerErrorCallback = () => this.setState({ alertVisible: ALERT_STATUS.ERROR });
  triggerSuccessCallback = () => this.setState({
    roleName: '',
    roleCapabilities: {},
    alertVisible: ALERT_STATUS.SUCCESS
  });
  
  selectRole = (event) => {
    const roleCapabilities = Object.assign({}, this.state.roleCapabilities);
    const { role } = event.target.dataset;
    if (roleCapabilities[role]) roleCapabilities[role] = !roleCapabilities[role];
    else roleCapabilities[role] = true;
    this.setState({ roleCapabilities });
  }

  saveRole = async (createRole) => {
    const listRoles = Object.keys(roleCapabilities);
    let accessPermission = 0;
    for (let index = 0; index < listRoles.length; index += 1) {
      if (this.state.roleCapabilities[listRoles[index]])
        accessPermission += roleCapabilities[listRoles[index]].value;
    }
    createRole({ variables: { name: this.state.roleName, accessPermission }});
  }

  renderRole = (item, index) => {
    return (
      <Col key={index} md={4} sm={12}>
        <Label check>
          <Input
            type="checkbox"
            checked={this.state.roleCapabilities[item]}
            onClick={this.selectRole}
            data-role={item}
          />
          {roleCapabilities[item].title}
        </Label>
      </Col>
    );
  }

  render() {
    const listRoles = Object.keys(roleCapabilities);

    return (
      <Mutation
        mutation={createRole}
        onError={this.triggerErrorCallback}
        onCompleted={this.triggerSuccessCallback}
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
                  <Link to="/admin/user"><FontAwesome icon="users" /> Role</Link>
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
                          <Row>
                            {listRoles.map(this.renderRole)}
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