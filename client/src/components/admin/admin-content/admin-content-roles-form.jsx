import React from 'react';
import { Row, Col, Form as BootstrapForm, Input, FormGroup, Label, Button, Alert } from 'reactstrap';
import styled from 'styled-components';
import { Form, Checkbox } from 'react-form';
import { withHandlers, compose } from 'recompose';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

import { BootstrapTextField } from '../../../shared/formFields';
import { requiredValidation } from '../../../utils/validation';
import { ALERT_STATUS, ROLE_CAPABILITIES } from '../../../utils/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';

const AdminContentRolesFormComponent = ({
  breadcrumbItems,
  renderTopTitle,
  alertVisible,
  alertContent,
  removeAlert,
  renderRole,
  selectAllRoles,
  listRoles,
  saveRole,
  initValue,
  intl
}) => (
  <Form onSubmit={saveRole} getApi={initValue}>
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
            <BoxWrapper color="primary" title={intl.messages['edit_role.role_capabilities']}>
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
                      <Label sm={3}>
                        <FormattedMessage id='edit_role.role_capabilities' />
                      </Label>
                      <Col sm={9}>
                        <SelectAllRowStyled>
                          <Col sm={12}>
                            <Label check>
                              <Input
                                type="checkbox"
                                checked={Object.keys(_.pickBy(formApi.values, value => value === true)).length === listRoles.length}
                                onClick={(e) => selectAllRoles(e, formApi)}
                              />
                              <FormattedMessage id='edit_role.select_all' />
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

const SelectAllRowStyled = styled(Row)`
  margin-bottom: 15px;
`;

export default compose(
  injectIntl,
  withHandlers({
    renderRole: () => (item, index) => {
      const roleComponent = (
        <Col key={index} md={4} sm={12}>
          <Label check>
            <Checkbox field={item} className="form-check-input" />
            {ROLE_CAPABILITIES[item].title}
          </Label>
        </Col>
      );
      return roleComponent;
    }
  })
)(AdminContentRolesFormComponent);