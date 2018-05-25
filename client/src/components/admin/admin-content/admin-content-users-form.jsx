import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Row, Col, Collapse, Button, Form as BootstrapForm, Alert, FormGroup, Label } from 'reactstrap';
import { Form } from 'react-form';
import { injectIntl, FormattedMessage } from 'react-intl';
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
  setEditUserChangePassword,
  intl
}) => (
  <ContentContainer>
    <Form onSubmit={submitForm} getApi={initValue}>
      {formApi => (
        <BootstrapForm onSubmit={formApi.submitForm}>
          <ContentHeader>
            <h1>
              <FormattedMessage id={renderTopTitle()} />
            </h1>
            <Breadcrumb items={breadcrumbItems} />
          </ContentHeader>
          <ContentBody>
            <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
              {alertContent}
            </Alert>
            <BoxWrapper color="primary" title={intl.messages['edit_user.basic_information']} isLoading={formIsLoading}>
              <BoxBody>
                <Row>
                  <Col lg={6} md={12}>
                    <BootstrapTextField
                      field="username"
                      label={intl.messages['fields.username']}
                      type="text"
                      required={true}
                      validate={requiredValidation}
                      disabled={isEditedUser}
                    />
                    {isEditedUser && !editUserChangePassword ? (
                      <FormGroup row>
                        <Label sm={3}><FormattedMessage id='fields.password' /></Label>
                        <Col sm={9}>
                          <Button color="link" onClick={() => setEditUserChangePassword(true)}><FormattedMessage id='fields.change_password' />?</Button>
                        </Col>
                      </FormGroup>
                    ) : (
                      <div>
                        <BootstrapTextField
                          field="password"
                          label={intl.messages['fields.password']}
                          type="password"
                          required={true}
                          validate={requiredValidation}
                        />
                        <BootstrapTextField
                          field="retype_password"
                          label={intl.messages['fields.retype_password']}
                          type="password"
                          required={true}
                          validate={value => passwordMatchValidation(value, formApi.values.password)}
                        />
                      </div>
                    )}
                    <BootstrapSelectField
                      field="role"
                      label={intl.messages['fields.role']}
                      data={[
                        { value: '', text: `-- ${intl.messages['please_select']} --`},
                        ...roles.map(roleMapper)
                      ]}
                      required={true}
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="identityCard"
                      label={intl.messages['fields.identity_card']}
                      type="text"
                      required={true}
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="phone"
                      label={intl.messages['fields.phone']}
                      type="text"
                      required={true}
                      validate={requiredValidation}
                    />
                  </Col>
                  <Col lg={6} md={12}>
                    <div className="box box-success box-solid">
                      <div className="box-header with-border">
                        <h3 className="box-title">
                          <FormattedMessage id='edit_user.additional_information' />
                        </h3>
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
                            label={intl.messages['fields.fullname']}
                            type="text"
                          />
                          <BootstrapTextField
                            field="address"
                            label={intl.messages['fields.address']}
                            type="text"
                          />
                          <BootstrapTextField
                            field="email"
                            label={intl.messages['fields.email']}
                            type="text"
                            validate={emailValidation}
                          />
                          <BootstrapTextField
                            field="banking"
                            label={intl.messages['fields.banking']}
                            type="text"
                          />
                          <BootstrapTextField
                            field="bankingNumber"
                            label={intl.messages['fields.banking_number']}
                            type="text"
                          />
                          <BootstrapTextField
                            field="bankingOwner"
                            label={intl.messages['fields.banking_owner']}
                            type="text"
                          />
                        </Collapse>
                      </div>
                    </div>
                  </Col>
                </Row>
              </BoxBody>
              <BoxFooter>
                <Button color="primary" type="submit" className="float-right">
                  <FormattedMessage id='save' />
                </Button>
              </BoxFooter>
            </BoxWrapper>
          </ContentBody>
        </BootstrapForm>
      )}
    </Form>
  </ContentContainer>
);

export default compose(
  injectIntl,
  withHandlers({
    roleMapper: () => item => ({
      text: item.name,
      value: item.id
    })
  })
)(AdminContentUsersFormComponent);