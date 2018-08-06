import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AdminContainer from './containers/admin/admin';
import AdminLoginContainer from './containers/admin/admin-login';

const RouterComponent = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/login' component={AdminLoginContainer} />
      <Route path='/' component={AdminContainer} />
    </Switch>
  </BrowserRouter>
);

export default RouterComponent;