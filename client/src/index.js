import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import RouterComponent from './router';
import '@fortawesome/fontawesome-free-solid';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './assets/css/AdminLTE.css';
import './assets/css/_all-skins.css';
import './assets/css/skin-green.css';
import './assets/css/global.css';

ReactDOM.render(<RouterComponent />, document.getElementById('root'));