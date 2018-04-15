import { compose, withHandlers, withState, withStateHandlers, lifecycle } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import AdminLoginContainer from '../../components/admin/admin-login';
import { LOGIN } from '../../utils/graphql';
import { ALERT_STATUS } from '../../commons/enum';

export default compose(
  graphql(LOGIN, { name: 'loginApi' }),
  withRouter,
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    null,
    {
      removeAlert: () => () => ({ alertVisible: ALERT_STATUS.HIDDEN }),
    }),
  withHandlers({
    onLogin: ({ loginApi, history, setAlertContent, setAlert }) => async ({ username, password }) => {
      const variables = {
        username,
        password
      };

      const { data } = await loginApi({variables});

      if (data.login) {
        localStorage.setItem('token', data.login);
        history.push('/admin');
      }
      else {
        setAlertContent('Login failed. Please check username or password');
        setAlert(ALERT_STATUS.ERROR);
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      const token = localStorage.getItem('token');
      if (token) {
        this.props.history.push('/admin');
      }
    }
  })
)(AdminLoginContainer);