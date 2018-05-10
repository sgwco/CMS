import React from 'react';
import { Form as BootstrapForm, Alert, Row, Col, Button } from 'reactstrap';
import { Form } from 'react-form';
import { compose, withHandlers } from 'recompose';

import { ALERT_STATUS } from '../../../utils/enum';
import { requiredValidation } from '../../../utils/validation';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';
import { BootstrapTextField, BootstrapSelectField } from '../../../shared/formFields';

const AdminContentPostsFormComponent = ({
  submitForm,
  initValue,
  breadcrumbItems,
  renderTopTitle,
  alertVisible,
  alertContent,
  removeAlert,
  userMapper,
  getUsers: { users = [] },
  categoryMapper,
  getCategories: { categories =[] }
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
                      field="title"
                      label="Title"
                      type="text"
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="content"
                      label="Content"
                      type="text"
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="excerpt"
                      label="Excerpt"
                      type="text"
                    />
                    <BootstrapSelectField
                      field="author"
                      label="Author"
                      data={[
                        { value: '', text: '-- Please Select --'},
                        ...users.map(userMapper)
                      ]}
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="slug"
                      label="Slug"
                      type="text"
                    />
                    <BootstrapSelectField
                      field="category"
                      label="Category"
                      data={[
                        { value: '', text: '-- Please Select --'},
                        ...categories.map(categoryMapper)
                      ]}
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="thumbnail"
                      label="Thumbnail"
                      type="text"
                    />
                    <BootstrapTextField
                      field="count"
                      label="Count"
                      type="number"
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
export default compose(
  withHandlers({
    userMapper: () => item => ({
      text: item.fullname,
      value: item.id
    }),
    categoryMapper: () => item => ({
      text: item.name,
      value: item.id
    })
  })
)(AdminContentPostsFormComponent);