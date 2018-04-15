import React from 'react';
import { Form as BootstrapForm, FormGroup, Input, Label, Button, Alert } from 'reactstrap';
import styled from 'styled-components';
import { Form } from 'react-form';

import { BootstrapTextField } from '../../shared/formFields';
import { requiredValidation } from '../../utils/validation';
import logo from '../../assets/img/logo.png';
import wallpaper from '../../assets/img/wallpaper.jpg';
import { ALERT_STATUS } from '../../commons/enum';

const AdminLoginComponent = ({
  onLogin,
  alertVisible,
  removeAlert,
  alertContent
}) => (
  <Form onSubmit={onLogin}>
    {(formApi) => (
      <BootstrapForm onSubmit={formApi.submitForm}>
        <LoginWrapperStyled>
          <LoginContainerStyled>
            <LogoStyled src={logo} alt="logo" />
            <div className="login-form">
              <LoginHeaderStyled>
                <h3 className="text-center">Đăng nhập</h3>
              </LoginHeaderStyled>
              <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
                {alertContent}
              </Alert>
              <div className="login-form">
                <BootstrapTextField
                  field="username"
                  label="Username"
                  type="text"
                  validate={requiredValidation}
                />
                <BootstrapTextField
                  field="password"
                  label="Password"
                  type="password"
                  validate={requiredValidation}
                />
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" /> Remember?
                  </Label>
                </FormGroup>
                <div className="text-center">
                  <Button color="primary" type="submit">Login</Button>
                </div>
                <LoginForgetPasswordStyled className="text-center">
                  <a href="#">Forgot password?</a>
                </LoginForgetPasswordStyled>
              </div>
            </div>
          </LoginContainerStyled>
        </LoginWrapperStyled>
      </BootstrapForm>
    )}
  </Form>
);

const LoginWrapperStyled = styled.div`
  background: url(${wallpaper}) no-repeat center center;
  background-size: cover;
  width: 100%;
  height: 100%;
  padding-top: 10vh;
`;

const LoginContainerStyled = styled.div`
  width: 22%;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
`;

const LogoStyled = styled.img`
  width: 150px;
  display: block;
  margin: 0 auto;
`;

const LoginHeaderStyled = styled.div`
  font-size: 2.5rem;
`;

const LoginForgetPasswordStyled = styled.div`
  margin-top: 15px;
`;

export default AdminLoginComponent;