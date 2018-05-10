import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Row, Col, Collapse, Button, Form as BootstrapForm, Alert, FormGroup, Label } from 'reactstrap';
import { Form } from 'react-form';
import { compose, withHandlers } from 'recompose';

import { requiredValidation, passwordMatchValidation, emailValidation } from '../../../utils/validation';
import { ALERT_STATUS } from '../../../utils/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
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
  initValue,
  roleMapper,
  formIsLoading,
  editUserChangePassword,
  setEditUserChangePassword
}) => (
  <ContentContainer>
    <Form onSubmit={submitForm} getApi={initValue}>
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
            <BoxWrapper color="primary" title="Basic Information" isLoading={formIsLoading}>
              <BoxBody>
                <Row>
                  <Col lg={6} md={12}>
                    <BootstrapTextField
                      field="username"
                      label="Username"
                      type="text"
                      required={true}
                      validate={requiredValidation}
                      disabled={isEditedUser}
                    />
                    {isEditedUser && !editUserChangePassword ? (
                      <FormGroup row>
                        <Label sm={3}>Password</Label>
                        <Col sm={9}>
                          <Button color="link" onClick={() => setEditUserChangePassword(true)}>Change Password?</Button>
                        </Col>
                      </FormGroup>
                    ) : (
                      <div>
                        <BootstrapTextField
                          field="password"
                          label="Password"
                          type="password"
                          required={true}
                          validate={requiredValidation}
                        />
                        <BootstrapTextField
                          field="retype_password"
                          label="Retype Password"
                          type="password"
                          required={true}
                          validate={value => passwordMatchValidation(value, formApi.values.password)}
                        />
                      </div>
                    )}
                    <BootstrapSelectField
                      field="role"
                      label="Role"
                      data={[
                        { value: '', text: '-- Please Select --'},
                        ...roles.map(roleMapper)
                      ]}
                      required={true}
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="identityCard"
                      label="Identity Card"
                      type="text"
                      required={true}
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="phone"
                      label="Phone"
                      type="text"
                      required={true}
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
                            field="email"
                            label="Email"
                            type="text"
                            validate={emailValidation}
                          />
                          <BootstrapTextField
                            field="banking"
                            label="Banking"
                            type="text"
                          />
                          <BootstrapTextField
                            field="bankingNumber"
                            label="Banking Number"
                            type="text"
                          />
                          <BootstrapTextField
                            field="bankingOwner"
                            label="Banking Owner"
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