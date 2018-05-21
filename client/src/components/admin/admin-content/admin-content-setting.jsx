import React from 'react';
import { compose, withHandlers } from 'recompose';
import { Row, Col, Form as BootstrapForm, Button, Alert } from 'reactstrap';
import { Form } from 'react-form';

import { ContentHeaderTitleStyled } from '../../../shared/components';
import { BootstrapSelectField, BootstrapTextField } from '../../../shared/formFields';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
import Breadcrumb from '../../../shared/breadcrumb';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';
import { requiredValidation } from '../../../utils/validation';
import { ALERT_STATUS } from '../../../utils/enum';

const AdminContentDashboardComponent = ({
  breadcrumbItems,
  languages,
  languageMapper,
  submitForm,
  initValue,
  alertVisible,
  removeAlert,
  alertContent
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Setting</span>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
        {alertContent}
      </Alert>
      <Form onSubmit={submitForm} getApi={initValue}>
        {formApi => (
          <BootstrapForm onSubmit={formApi.submitForm}>
            <BoxWrapper color="primary">
              <BoxBody>
                <Row>
                  <Col sm={{ size: 6, offset: 3 }}>
                    <BootstrapSelectField
                      field="language"
                      label="Language"
                      data={[ ...languages.map(languageMapper) ]}
                    />
                    <BootstrapTextField
                      field="company_name"
                      label="Company Name"
                      type="text"
                      validate={requiredValidation}
                    />
                  </Col>
                </Row>
              </BoxBody>
              <BoxFooter>
                <Button color="primary" type="submit" className="float-right">Save</Button>
              </BoxFooter>
            </BoxWrapper>
          </BootstrapForm>
        )}
      </Form>
    </ContentBody>
  </ContentContainer>
);

export default compose(
  withHandlers({
    languageMapper: () => item => ({
      text: item.title,
      value: item.key
    })
  })
)(AdminContentDashboardComponent);