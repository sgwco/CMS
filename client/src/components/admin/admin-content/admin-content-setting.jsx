import React from 'react';
import { compose, withHandlers } from 'recompose';
import { Row, Col, Form as BootstrapForm, Button } from 'reactstrap';
import { Form } from 'react-form';

import { ContentHeaderTitleStyled } from '../../../shared/components';
import { BootstrapSelectField } from '../../../shared/formFields';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
import Breadcrumb from '../../../shared/breadcrumb';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';

const AdminContentDashboardComponent = ({
  breadcrumbItems,
  languages,
  languageMapper,
  submitForm
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Setting</span>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <Form onSubmit={submitForm}>
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