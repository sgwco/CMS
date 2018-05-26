import React from 'react';
import { compose, withHandlers } from 'recompose';
import { Row, Col, Form as BootstrapForm, Button, Alert } from 'reactstrap';
import { Form } from 'react-form';
import { FormattedMessage, injectIntl } from 'react-intl';

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
  alertContent,
  intl
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <FormattedMessage id='categories.settings' />
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
        <FormattedMessage id={alertContent} />
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
                      label={intl.messages['fields.language']}
                      data={[ ...languages.map(languageMapper) ]}
                    />
                    <BootstrapTextField
                      field="company_name"
                      label={intl.messages['fields.company_name']}
                      type="text"
                      validate={requiredValidation}
                    />
                    {/* <BootstrapFileField
                      field="logo"
                      label={intl.messages['fields.logo']}
                      buttonLabel={intl.messages['choose_image']}
                      acceptedExtension={['.jpg', '.png', '.jpeg', '.gif']}
                      maxFileSize={2097152}
                    /> */}
                  </Col>
                </Row>
              </BoxBody>
              <BoxFooter>
                <Button color="primary" type="submit" className="float-right">
                  <FormattedMessage id='save' />
                </Button>
              </BoxFooter>
            </BoxWrapper>
          </BootstrapForm>
        )}
      </Form>
    </ContentBody>
  </ContentContainer>
);

export default compose(
  injectIntl,
  withHandlers({
    languageMapper: ({ intl }) => item => ({
      text: intl.messages[item.title],
      value: item.key
    })
  })
)(AdminContentDashboardComponent);