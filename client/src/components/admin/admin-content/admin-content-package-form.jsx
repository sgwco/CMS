import React from 'react';
import { Row, Col, Form as BootstrapForm, Button, Alert } from 'reactstrap';
import { Form } from 'react-form';
import { compose, withHandlers } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import moment from 'moment';

import { BootstrapSelectField, BootstrapDatepickerField, BootstrapMoneyAmountField, BootstrapTextField } from '../../../shared/formFields';
import { requiredValidation, numberValidation, dateValidation } from '../../../utils/validation';
import { ALERT_STATUS, DURATION_TYPE } from '../../../utils/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
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
  intl
}) => (
  <Form onSubmit={savePackage} getApi={initValue}>
    {(formApi) => (
      <BootstrapForm onSubmit={formApi.submitForm}>
        <ContentContainer>
          <ContentHeader>
            <h1><FormattedMessage id={renderTopTitle()} /></h1>
            <Breadcrumb items={breadcrumbItems} />
          </ContentHeader>
          <ContentBody>
            <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
              <FormattedMessage id={alertContent} />
            </Alert>
            <BoxWrapper color="primary" title={intl.messages['edit_user.basic_information']}>
              <BoxBody>
                <Row>
                  <Col sm={{ size: 6, offset: 3 }}>
                    <BootstrapTextField
                      field="packageId"
                      label={intl.messages['fields.package_id']}
                      type='text'
                      validate={requiredValidation}
                    />
                    <BootstrapSelectField
                      field="userId"
                      label={intl.messages['fields.username']}
                      data={[
                        { value: '', text: `-- ${intl.messages['please_select']} --`},
                        ...users.map(userMapper)
                      ]}
                      validate={requiredValidation}
                    />
                    <BootstrapMoneyAmountField
                      field="price"
                      label={intl.messages['fields.package_price']}
                      type="text"
                      validate={numberValidation}
                    />
                    <BootstrapSelectField
                      field="duration"
                      label={intl.messages['fields.duration']}
                      data={[
                        { value: '', text: `-- ${intl.messages['please_select']} --`},
                        ...durationSelectItems()
                      ]}
                      validate={requiredValidation}
                    />
                    <BootstrapSelectField
                      field="introducer"
                      label={intl.messages['fields.introducer']}
                      data={[
                        { value: '', text: `-- ${intl.messages['please_select']} --`},
                        ...users.map(userMapper)
                      ]}
                    />
                    <BootstrapDatepickerField
                      field="registerDate"
                      label={intl.messages['fields.register_date']}
                      validate={dateValidation}
                      defaultValue={moment().format('DD/MM/YYYY')}
                    />
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
        </ContentContainer>
      </BootstrapForm>
    )}
  </Form>
);

export default compose(
  injectIntl,
  withHandlers({
    userMapper: () => item => ({
      text: item.username,
      value: item.id
    }),
    durationSelectItems: ({ intl }) => () => Object.keys(DURATION_TYPE)
      .map(item => ({
        text: `${DURATION_TYPE[item]} ${intl.messages['month.months']}`,
        value: item
      }))
  })
)(AdminContentPackageFormComponent);