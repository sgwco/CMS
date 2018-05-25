import React from 'react';
import ReactDOM from 'react-dom';
import RouterComponent from './router';
import { IntlProvider, addLocaleData } from 'react-intl';
import locale_en from 'react-intl/locale-data/en';
import locale_vi from 'react-intl/locale-data/vi';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import '@fortawesome/fontawesome-free-solid';

import messages_vi from './languages/vi.json';
import messages_en from './languages/en.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './assets/css/AdminLTE.css';
import './assets/css/_all-skins.css';
import './assets/css/skin-green.css';
import './assets/css/global.css';

addLocaleData([...locale_en, ...locale_vi]);
const messages = {
  vi: messages_vi,
  en: messages_en
};

const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api' // eslint-disable-line
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

if (!localStorage.getItem('language')) localStorage.setItem('language', 'vi');
const locale = localStorage.getItem('language');

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const renderFragment = ({ children }) => children;

const MainComponent = () => (
  <ApolloProvider client={client}>
    <IntlProvider locale={locale} messages={messages[locale]} textComponent={renderFragment}>
      <RouterComponent />
    </IntlProvider>
  </ApolloProvider>
);

ReactDOM.render(<MainComponent />, document.getElementById('root'));