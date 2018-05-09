import React from 'react';
import { Row, Col, Form as BootstrapForm, Button, Alert } from 'reactstrap';
import { Form } from 'react-form';
import { compose, withHandlers } from 'recompose';
import moment from 'moment';

import { BootstrapSelectField, BootstrapDatepickerField, BootstrapMoneyAmountField } from '../../../shared/formFields';
import { requiredValidation, numberValidation, dateValidation } from '../../../utils/validation';
import { ALERT_STATUS, DURATION_TYPE } from '../../../utils/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';

const AdminContentPackageFormComponent = ({
  breadcrumbItems,
  renderTopTitle,
  alertVisible,
  alertContent,
  removeAlert,
  savePackage,
  initValue,
  userMapper,
  durationSelectItems,
  getUsers: { users = [] },
}) => (
  <Form onSubmit={savePackage} getApi={initValue}>
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
                  <Col sm={{ size: 6, offset: 3 }}>
                    <BootstrapSelectField
                      field="userId"
                      label="User"
                      data={[
                        { value: '', text: '-- Please Select --'},
                        ...users.map(userMapper)
                      ]}
                      validate={requiredValidation}
                    />
                    <BootstrapMoneyAmountField
                      field="price"
                      label="Price"
                      type="text"
                      validate={numberValidation}
                    />
                    <BootstrapSelectField
                      field="duration"
                      label="Duration"
                      data={[
                        { value: '', text: '-- Please Select --'},
                        ...durationSelectItems()
                      ]}
                      validate={requiredValidation}
                    />
                    <BootstrapDatepickerField
                      field="registerDate"
                      label="Register Date"
                      validate={dateValidation}
                      defaultValue={moment().format('DD/MM/YYYY')}
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
    durationSelectItems: () => () => Object.keys(DURATION_TYPE)
      .map(item => ({
        text: `${DURATION_TYPE[item]} Months`,
        value: item
      }))
  })
)(AdminContentPackageFormComponent);