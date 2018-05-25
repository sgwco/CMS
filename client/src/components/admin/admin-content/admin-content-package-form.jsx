import React from 'react';
import { Row, Col, Form as BootstrapForm, Button, Alert } from 'reactstrap';
import { Form } from 'react-form';
import { compose, withHandlers } from 'recompose';
import moment from 'moment';

import { BootstrapSelectField, BootstrapDatepickerField, BootstrapMoneyAmountField, BootstrapTextField } from '../../../shared/formFields';
import { requiredValidation, numberValidation, dateValidation } from '../../../utils/validation';
import { ALERT_STATUS, DURATION_TYPE } from '../../../utils/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';
import lang from '../../../languages';

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
  language
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
            <BoxWrapper color="primary" title={lang('package_detail', language)}>
              <BoxBody>
                <Row>
                  <Col sm={{ size: 6, offset: 3 }}>
                    <BootstrapTextField
                      field="packageId"
                      label={lang('package_id', language)}
                      type='text'
                      validate={requiredValidation}
                    />
                    <BootstrapSelectField
                      field="userId"
                      label={lang('user', language)}
                      data={[
                        { value: '', text: `-- ${lang('please_select', language)} --`},
                        ...users.map(userMapper)
                      ]}
                      validate={requiredValidation}
                    />
                    <BootstrapMoneyAmountField
                      field="price"
                      label={lang('price', language)}
                      type="text"
                      validate={numberValidation}
                    />
                    <BootstrapSelectField
                      field="duration"
                      label={lang('duration', language)}
                      data={[
                        { value: '', text: `-- ${lang('please_select', language)} --`},
                        ...durationSelectItems()
                      ]}
                      validate={requiredValidation}
                    />
                    <BootstrapSelectField
                      field="introducer"
                      label={lang('introducer', language)}
                      data={[
                        { value: '', text: `-- ${lang('please_select', language)} --`},
                        ...users.map(userMapper)
                      ]}
                    />
                    <BootstrapDatepickerField
                      field="registerDate"
                      label={lang('register_date', language)}
                      validate={dateValidation}
                      defaultValue={moment().format('DD/MM/YYYY')}
                    />
                  </Col>
                </Row>
              </BoxBody>
              <BoxFooter>
                <Button color="primary" type="submit" className="float-right">{lang('save', language)}</Button>
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
    durationSelectItems: ({ language }) => () => Object.keys(DURATION_TYPE)
      .map(item => ({
        text: `${DURATION_TYPE[item]} ${lang('months', language)}`,
        value: item
      }))
  })
)(AdminContentPackageFormComponent);