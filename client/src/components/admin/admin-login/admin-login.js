import React from 'react';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import styles from './admin-login.css';
import logo from '../../../assets/img/logo.png';

export default class AdminLoginComponent extends React.Component {
  render() {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginContainer}>
          <img src={logo} alt="logo" className={styles.logo} />
          <div className="login-form">
            <div className={styles.loginHeader}>
              <h3 className="text-center">Đăng nhập</h3>
            </div>
            <div className="login-form">
              <Form>
                <FormGroup>
                  <Input type="text" name="username" placeholder="Tài khoản" />
                </FormGroup>
                <FormGroup>
                  <Input type="password" name="password" placeholder="Mật khẩu" />
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" /> Ghi nhớ?
                  </Label>
                </FormGroup>
                <div className="text-center">
                  <Button color="primary">Đăng nhập</Button>
                </div>
                <div className={[styles.forgetPassword, 'text-center'].join(' ')}>
                  <a href="#">Quên mật khẩu?</a>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}