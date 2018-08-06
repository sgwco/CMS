import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import AdminLoginContainer from '../../components/admin/admin-login';
import { LOGIN } from '../../utils/graphql';
import { ALERT_STATUS } from '../../utils/enum';

export default compose(
  graphql(LOGIN, { name: 'loginApi' }),
  withRouter,
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    onLogin: ({ loginApi, setAlertContent, setAlert }) => async ({ username, password }) => {
      const variables = {
        username,
        password
      };

      const { data } = await loginApi({variables});

      if (data.login) {
        localStorage.setItem('token', data.login);
        window.location = '/';
      }
      else {
        setAlertContent('error.login_failed');
        setAlert(ALERT_STATUS.ERROR);
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      const token = localStorage.getItem('token');
      if (token) {
        window.location = '/';
      }
    }
  })
)(AdminLoginContainer);