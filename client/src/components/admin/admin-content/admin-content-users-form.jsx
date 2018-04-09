import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Row, Col, Collapse, Button, Form as BootstrapForm, Alert } from 'reactstrap';
import { Form } from 'react-form';
import { compose, withHandlers } from 'recompose';

import { requiredValidation, passwordMatchValidation, emailValidation } from '../../../utils/validation';
import { ALERT_STATUS } from '../../../commons/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';
import { BootstrapTextField, BootstrapSelectField } from '../../../shared/formFields';

const AdminContentUsersFormComponent = ({
  submitForm,
  alertVisible,
  removeAlert,
  alertContent,
  renderTopTitle,
  breadcrumbItems,
  isEditedUser,
  getRoles: { roles = [] },
  toggleAdditionalForm,
  additionalInformationVisible,
  roleMapper
}) => (
  <ContentContainer>
    <Form onSubmit={submitForm} getApi={this.getFormApi}>
      {formApi => (
        <BootstrapForm onSubmit={formApi.submitForm}>
          <ContentHeader>
            <h1>{renderTopTitle()}</h1>
            <Breadcrumb items={breadcrumbItems} />
          </ContentHeader>
          <ContentBody>
            <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
              {alertContent}
            </Alert>
            <BoxWrapper color="primary" title="Basic Information">
              <BoxBody>
                <Row>
                  <Col lg={6} md={12}>
                    <BootstrapTextField
                      field="username"
                      label="Username"
                      type="text"
                      validate={requiredValidation}
                      disabled={isEditedUser}
                    />
                    <BootstrapTextField
                      field="password"
                      label="Password"
                      type="password"
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="retype_password"
                      label="Retype Password"
                      type="password"
                      validate={value => passwordMatchValidation(value, formApi.values.password)}
                    />
                    <BootstrapTextField
                      field="email"
                      label="Email"
                      type="text"
                      validate={emailValidation}
                    />
                    <BootstrapSelectField
                      field="role"
                      label="Role"
                      data={[
                        { value: '', text: '-- Please Select --'},
                        ...roles.map(roleMapper)
                      ]}
                      validate={requiredValidation}
                    />
                  </Col>
                  <Col lg={6} md={12}>
                    <div className="box box-success box-solid">
                      <div className="box-header with-border">
                        <h3 className="box-title"> Additional Information </h3>
                        <div className="box-tools float-right">
                          <button
                            type="button"
                            className="btn btn-box-tool"
                            onClick={toggleAdditionalForm}>
                            <FontAwesome icon={additionalInformationVisible ? 'minus' : 'plus'} />
                          </button>
                        </div>
                      </div>
                      <div className="box-body">
                        <Collapse isOpen={additionalInformationVisible}>
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
              </BoxBody>
              <BoxFooter>
                <Button color="primary" type="submit" className="float-right">Save</Button>
              </BoxFooter>
            </BoxWrapper>
          </ContentBody>
        </BootstrapForm>
      )}
    </Form>
  </ContentContainer>
);

export default compose(
  withHandlers({
    roleMapper: () => item => ({
      text: item.name,
      value: item.id
    })
  })
)(AdminContentUsersFormComponent);