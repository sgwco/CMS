import { compose, withHandlers, withState, withStateHandlers, withProps } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentSubscriptionComponent from '../../../components/admin/admin-content/admin-content-subscription';
import { ALERT_STATUS } from '../../../commons/enum';
import { GET_ALL_SUBSCRIPTIONS, REMOVE_SUBSCRIPTION } from '../../../utils/graphql';

export default compose(
  graphql(GET_ALL_SUBSCRIPTIONS, { name: 'getSubscriptions' }),
  graphql(REMOVE_SUBSCRIPTION, { name: 'removeSubscription' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Subscription' }
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
    onRemoveSubscription: ({ removeSubscription, setAlertContent, setAlert }) => async id => {
      const result = confirm('Do you want to remove this subscription?');
      if (result) {
        try {
          await removeSubscription({
            variables: { id },
            optimisticResponse: {
              __typename: 'Mutation',
              removeUser: {
                __typename: 'String',
                id
              }
            },
            update(cache, { data: { removeSubscription } }) {
              let { subscriptions } = cache.readQuery({ query: GET_ALL_SUBSCRIPTIONS });
              subscriptions = subscriptions.filter(item => item.id !== removeSubscription);
              cache.writeQuery({ query: GET_ALL_SUBSCRIPTIONS, data: { subscriptions } });
            }
          });

          setAlertContent('Remove subscription successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent('Error: ' + e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    }
  })
)(AdminContentSubscriptionComponent);