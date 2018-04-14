import React from 'react';
import { Row, Col, Form as BootstrapForm, Button, Alert } from 'reactstrap';
import { Form } from 'react-form';

import { BootstrapTextField } from '../../../shared/formFields';
import { requiredValidation, numberValidation } from '../../../utils/validation';
import { ALERT_STATUS } from '../../../commons/enum';
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
  initValue
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
                    <BootstrapTextField
                      field="name"
                      label="Package Name"
                      type="text"
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="price"
                      label="Price"
                      type="text"
                      validate={numberValidation}
                    />
                    <BootstrapTextField
                      field="interestRate"
                      label="Interest Rate"
                      type="text"
                      validate={numberValidation}
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

export default AdminContentPackageFormComponent;