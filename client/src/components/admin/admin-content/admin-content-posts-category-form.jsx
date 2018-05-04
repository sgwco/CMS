import React from 'react';
import { Form as BootstrapForm, Alert, Row, Col, Button } from 'reactstrap';
import { Form } from 'react-form';

import { ALERT_STATUS } from '../../../utils/enum';
import { requiredValidation } from '../../../utils/validation';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';
import { BootstrapTextField } from '../../../shared/formFields';

const AdminContentPostsCategoryFormComponent = ({
  submitForm,
  initValue,
  breadcrumbItems,
  renderTopTitle,
  alertVisible,
  alertContent,
  removeAlert,
}) => (
  <ContentContainer>
    <Form onSubmit={submitForm} getApi={initValue}>
      {(formApi) => (
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
                  <Col lg="12" md="12">
                    <BootstrapTextField
                      field="name"
                      label="Name"
                      type="text"
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="slug"
                      label="Slug"
                      type="text"
                    />
                    <BootstrapTextField
                      field="parent"
                      label="Parent"
                      type="text"
                    />
                    <BootstrapTextField
                      field="description"
                      label="Description"
                      type="text"
                    />
                    <BootstrapTextField
                      field="thumbnail"
                      label="Thumbnail"
                      type="text"
                    />
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
export default AdminContentPostsCategoryFormComponent;