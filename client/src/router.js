import React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AdminContainer from './containers/admin/admin';
import AdminLoginContainer from './containers/admin/admin-login';

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/api'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token || ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default class RouterComponent extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <Switch>
            <Route exact path='/admin/login' component={AdminLoginContainer} />
            <Route path='/admin' component={AdminContainer} />
          </Switch>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}