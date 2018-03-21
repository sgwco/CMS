import React from 'react';
import ReactDOM from 'react-dom';
import RouterComponent from './router';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/fontawesome.min.css';
import './assets/css/fa-regular.min.css';
import './assets/css/AdminLTE.css';
import './assets/css/skin-green.css';

ReactDOM.render(<RouterComponent />, document.getElementById('root'));
registerServiceWorker();
