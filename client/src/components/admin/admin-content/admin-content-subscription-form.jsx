import React from 'react';
import { Row, Col, Form as BootstrapForm, Button, Alert } from 'reactstrap';
import { Form } from 'react-form';
import { compose, withHandlers } from 'recompose';

import { BootstrapSelectField } from '../../../shared/formFields';
import { requiredValidation } from '../../../utils/validation';
import { ALERT_STATUS } from '../../../utils/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';

const AdminContentSubscriptionFormContainer = ({
  breadcrumbItems,
  renderTopTitle,
  alertVisible,
  alertContent,
  removeAlert,
  saveSubscription,
  initValue,
  userMapper,
  getUsers: { users = [] },
  packageMapper,
  getPackages: { packages = [] }
}) => (
  <Form onSubmit={saveSubscription} getApi={initValue}>
    {(formApi) => (
      <BootstrapForm onSubmit={formApi.submitForm}>
        <ContentContainer>
          <ContentHeader>
            <h1>{renderTopTitle()}</h1>
            <Breadcrumb items={breadcrumbItems} />
          </ContentHeader>
          <ContentBody>
            <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
              {alertContent}
            </Alert>
            <BoxWrapper color="primary" title="Package Detail">
              <BoxBody>
                <Row>
                  <Col sm={12}>
                    <BootstrapSelectField
                      field="user_id"
                      label="User"
                      data={[
                        { value: '', text: '-- Please Select --'},
                        ...users.map(userMapper)
                      ]}
                      validate={requiredValidation}
                    />
                    <BootstrapSelectField
                      field="package_id"
                      label="Package"
                      data={[
                        { value: '', text: '-- Please Select --'},
                        ...packages.map(packageMapper)
                      ]}
                      validate={requiredValidation}
                    />
                    <BootstrapSelectField
                      field="duration"
                      label="Duration"
                      data={[
                        { value: '', text: '-- Please Select --'},
                        { value: '3', text: '3 Month' },
                        { value: '6', text: '6 Month' },
                        { value: '9', text: '9 Month' },
                        { value: '12', text: '12 Month' }
                      ]}
                      validate={requiredValidation}
                    />
                  </Col>
                </Row>
              </BoxBody>
              <BoxFooter>
                <Button color="primary" type="submit" className="float-right">Save</Button>
              </BoxFooter>
            </BoxWrapper>
          </ContentBody>
        </ContentContainer>
      </BootstrapForm>
    )}
  </Form>
);
export default compose(
  withHandlers({
    userMapper: () => item => ({
      text: item.username,
      value: item.id
    }),
    packageMapper: () => item => ({
      text: item.name,
      value: item.id
    })
  })
)(AdminContentSubscriptionFormContainer);