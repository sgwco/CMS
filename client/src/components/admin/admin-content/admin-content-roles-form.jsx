import React from 'react';
import { Row, Col, Form as BootstrapForm, Input, FormGroup, Label, Button, Alert } from 'reactstrap';
import styled from 'styled-components';
import { Form, Checkbox } from 'react-form';
import { withHandlers, compose } from 'recompose';

import { BootstrapTextField } from '../../../shared/formFields';
import { requiredValidation } from '../../../utils/validation';
import { ALERT_STATUS, roleCapabilities } from '../../../commons/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';

const AdminContentRolesFormComponent = ({
  breadcrumbItems,
  renderTopTitle,
  alertVisible,
  alertContent,
  removeAlert,
  renderRole,
  checkboxSelectAll,
  selectAllRoles,
  listRoles,
  saveRole
}) => (
  <Form onSubmit={saveRole}>
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
            <BoxWrapper color="primary" title="Role Capabilities">
              <BoxBody>
                <Row>
                  <Col sm={{ size: 6, offset: 3 }}>
                    <BootstrapTextField
                      field="roleName"
                      label="Role Name"
                      type="text"
                      validate={requiredValidation}
                    />
                    <FormGroup row>
                      <Label sm={3}>Role Capabilities</Label>
                      <Col sm={9}>
                        <SelectAllRowStyled>
                          <Col sm={12}>
                            <Label check>
                              <Input
                                type="checkbox"
                                checked={checkboxSelectAll}
                                onClick={() => selectAllRoles(formApi)}
                              />
                              Select all
                            </Label>
                          </Col>
                        </SelectAllRowStyled>
                        <Row>
                          {listRoles.map(renderRole)}
                        </Row>
                      </Col>
                    </FormGroup>
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

const SelectAllRowStyled = styled(Row)`
  margin-bottom: 15px;
`;

export default compose(
  withHandlers({
    renderRole: () => (item, index) => {
      const roleComponent = (
        <Col key={index} md={4} sm={12}>
          <Label check>
            <Checkbox field={item} className="form-check-input" />
            {roleCapabilities[item].title}
          </Label>
        </Col>
      );
      return roleComponent;
    }
  })
)(AdminContentRolesFormComponent);