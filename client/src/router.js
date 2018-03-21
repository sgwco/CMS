import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AdminComponent from './components/admin/admin';
import AdminLoginComponent from './components/admin/admin-login/admin-login';

export default class RouterComponent extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path='/admin/login' component={AdminLoginComponent} />
          <Route exact path='/admin' component={AdminComponent} />
        </div>
      </BrowserRouter>
    );
  }
}