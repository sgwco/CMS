import { compose, withHandlers, withState, withStateHandlers, withProps } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentPackageComponent from '../../../components/admin/admin-content/admin-content-package';
import { ALERT_STATUS } from '../../../commons/enum';
import { GET_ALL_PACKAGES } from '../../../utils/graphql';

export default compose(
  graphql(GET_ALL_PACKAGES, { name: 'getPackages' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Packages' }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    null,
    {
      removeAlert: () => () => ({ alertVisible: ALERT_STATUS.HIDDEN }),
    }
  ),
  withHandlers({
    onRemoveUser: ({ removeUser, setAlertContent, setAlert }) => async id => {
      const result = confirm('Do you want to remove this user?');
      if (result) {
        try {
          await removeUser({
            variables: { id },
            optimisticResponse: {
              __typename: 'Mutation',
              removeUser: {
                __typename: 'String',
                id
              }
            },
            update(cache, { data: { removeUser } }) {
              let { users } = cache.readQuery({ query: GET_ALL_PACKAGES });
              users = users.filter(item => item.id !== removeUser);
              cache.writeQuery({ query: GET_ALL_PACKAGES, data: { users } });
            }
          });

          setAlertContent('Remove user successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent('Error: ' + e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    }
  })
)(AdminContentPackageComponent);