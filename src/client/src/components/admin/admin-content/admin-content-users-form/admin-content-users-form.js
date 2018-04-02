import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Row, Col, Form, Input, FormGroup, Label } from 'reactstrap';

import styles from './admin-content-users-form.css';

export default class AdminContentUsersFormComponent extends React.Component {
  static propTypes = {
    isEditedUser: PropTypes.bool
  }

  static defaultProps = {
    isEditedUser: false
  }

  renderTopTitle = () => this.props.isEditedUser ? 'Edit User' : 'Add New User';

  render() {
    return (
      <div>
        <section className="content-header">
          <h1>
            {this.renderTopTitle()}
          </h1>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to='/admin'><FontAwesome icon="home" /> Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/admin/user"><FontAwesome icon="home" /> Users</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{this.renderTopTitle()}</BreadcrumbItem>
          </Breadcrumb>
        </section>
        <section className="content">
          <Row>
            <Col lg="6" md="12">
              <div className="box box-primary">
                <div className="box-header">
                  <div className="box-title">Basic Information</div>
                </div>
                <div className={[styles.boxBasicInfo, 'box-body'].join(' ')}>
                  <Form>
                    <FormGroup row>
                      <Label for="username" sm={3}>Username</Label>
                      <Col sm={9}>
                        <Input type="text" id="username" placeholder="Username" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="password" sm={3}>Password</Label>
                      <Col sm={9}>
                        <Input type="password" id="password" placeholder="Password" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="retype_password" sm={3}>Retype Password</Label>
                      <Col sm={9}>
                        <Input type="password" id="retype_password" placeholder="Retype Password" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="email" sm={3}>Email</Label>
                      <Col sm={9}>
                        <Input type="email" id="email" placeholder="Email" />
                      </Col>
                    </FormGroup>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </div>
    );
  }
}