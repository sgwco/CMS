import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import { Breadcrumb, BreadcrumbItem, Row, Col, Collapse, Button, Form as BootstrapForm } from 'reactstrap';
import { Form } from 'react-form';
import isEmail from 'validator/lib/isEmail';

import { GET_ROLES } from '../../../../utils/graphql';
import { BootstrapTextField, BootstrapSelectField } from '../../../../commons/formFields';
import styles from './admin-content-users-form.css';

export default class AdminContentUsersFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      additionalInformationVisible: false,
      formInput: {}
    };
  }

  static propTypes = {
    isEditedUser: PropTypes.bool
  };

  static defaultProps = {
    isEditedUser: false
  };

  renderTopTitle = () => (this.props.isEditedUser ? 'Edit User' : 'Add New User');

  toggleAdditionalForm = () =>
    this.setState({
      additionalInformationVisible: !this.state.additionalInformationVisible
    });

  renderRoleSelect = item => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  );

  requiredValidation = value => ({
    error: !value || value.trim() === '' ? 'This field is required' : null
  });

  passwordMatchValidation = (currentPassword, abovePassword) => {
    const required = this.requiredValidation(currentPassword);
    if (required.error !== null) return required;
    
    if (currentPassword !== abovePassword) {
      return { error: 'Password mismatch' };
    }

    return null;
  }

  emailValidation = value => {
    const required = this.requiredValidation(value);
    if (required.error !== null) return required;

    if (!isEmail(value)) {
      return { error: 'Email invalid' };
    }

    return null;
  }

  roleMapper = item => ({
    text: item.name,
    value: item.id
  });

  submitForm = (data) => {
    console.log(data);
  };

  render() {
    return (
      <Mutation
        mutation={this.createUser}
      >
        {() => (
          <Form onSubmit={this.submitForm}>
            {formApi => (
              <BootstrapForm onSubmit={formApi.submitForm}>
                <section className="content-header">
                  <h1> {this.renderTopTitle()} </h1>
                  <Breadcrumb>
                    <BreadcrumbItem>
                      <Link to="/admin"><FontAwesome icon="home" /> Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link to="/admin/user"><FontAwesome icon="home" /> Users</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active> {this.renderTopTitle()} </BreadcrumbItem>
                  </Breadcrumb>
                </section>
                <section className="content">
                  <div className="box box-primary">
                    <div className="box-header">
                      <div className="box-title">Basic Information</div>
                    </div>
                    <div className={[styles.boxBasicInfo, 'box-body'].join(' ')}>
                      <Row>
                        <Col lg={6} md={12}>
                          <BootstrapTextField
                            field="username"
                            label="Username"
                            type="text"
                            validate={this.requiredValidation}
                          />
                          <BootstrapTextField
                            field="password"
                            label="Password"
                            type="password"
                            validate={this.requiredValidation}
                          />
                          <BootstrapTextField
                            field="retype_password"
                            label="Retype Password"
                            type="password"
                            validate={value => this.passwordMatchValidation(value, formApi.values.password)}
                          />
                          <BootstrapTextField
                            field="email"
                            label="Email"
                            type="text"
                            validate={this.emailValidation}
                          />
                          <Query query={GET_ROLES}>
                            {({ data, loading }) => {
                              if (loading) return 'Loading...';
                              const dataRoles = [
                                { value: '', text: '-- Please Select --'},
                                ...data.roles.map(this.roleMapper)
                              ];
                              return (
                                <BootstrapSelectField
                                  field="role"
                                  label="Role"
                                  data={dataRoles}
                                  validate={this.requiredValidation}
                                />
                              );
                            }}
                          </Query>
                        </Col>
                        <Col lg={6} md={12}>
                          <div className="box box-success box-solid">
                            <div className="box-header with-border">
                              <h3 className="box-title"> Additional Information </h3>
                              <div className="box-tools float-right">
                                <button
                                  type="button"
                                  className="btn btn-box-tool"
                                  onClick={this.toggleAdditionalForm}>
                                  <FontAwesome icon={this.state.additionalInformationVisible ? 'minus' : 'plus'} />
                                </button>
                              </div>
                            </div>
                            <div className="box-body">
                              <Collapse isOpen={this.state.additionalInformationVisible}>
                                <BootstrapTextField
                                  field="fullname"
                                  label="Full Name"
                                  type="text"
                                />
                                <BootstrapTextField
                                  field="address"
                                  label="Address"
                                  type="text"
                                />
                                <BootstrapTextField
                                  field="phone"
                                  label="Phone"
                                  type="text"
                                />
                              </Collapse>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className="box-footer">
                      <Button color="primary" type="submit" className="float-right">Save</Button>
                    </div>
                  </div>
                </section>
              </BootstrapForm>
            )}
          </Form>
        )}
      </Mutation>
    );
  }
}
