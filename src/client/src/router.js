import React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AdminComponent from './components/admin/admin';
import AdminLoginComponent from './components/admin/admin-login/admin-login';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:8000/api' }),
  cache: new InMemoryCache()
});

export default class RouterComponent extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <Switch>
            <Route exact path='/admin/login' component={AdminLoginComponent} />
            <Route path='/admin' component={AdminComponent} />
          </Switch>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}