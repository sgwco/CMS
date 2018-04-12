import React from 'react';
import { Form as BootstrapForm, Alert, Row, Col, FormGroup } from 'reactstrap';
import { Form, Text, TextArea } from 'react-form';

import { ALERT_STATUS } from '../../../commons/enum';
import { requiredValidation } from '../../../utils/validation';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
// import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';

const AdminContentPostsFormComponent = ({
  breadcrumbItems,
  renderTopTitle,
  alertVisible,
  alertContent,
  removeAlert
}) => (
  <Form>
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
            <Row>
              <Col lg="9" md="12">
                <FormGroup>
                  <Text
                    field="postTitle"
                    placeholder="Post Title"
                    className="form-control form-control-lg"
                    validate={requiredValidation}
                  />
                  <TextArea
                    field="postContent"
                    placeholder="Content"
                    className="form-control"
                    validate={requiredValidation}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ContentBody>
        </ContentContainer>
      </BootstrapForm>
    )}
  </Form>
);

export default AdminContentPostsFormComponent;