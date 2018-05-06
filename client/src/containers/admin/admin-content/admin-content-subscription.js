import { compose, withHandlers, withState, withStateHandlers, withProps, branch, renderComponent, renderNothing } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentSubscriptionComponent from '../../../components/admin/admin-content/admin-content-subscription';
import AdminContentSubscriptionMemberComponent from '../../../components/admin/admin-content/admin-content-subscription-member';
import { ALERT_STATUS, roleCapabilities } from '../../../utils/enum';
import { GET_ALL_SUBSCRIPTIONS, REMOVE_SUBSCRIPTION, GET_USER_TOKEN, GET_ACTIVE_SUBSCRIPTION } from '../../../utils/graphql';

export default compose(
  graphql(GET_ALL_SUBSCRIPTIONS, { name: 'getSubscriptions' }),
  graphql(REMOVE_SUBSCRIPTION, { name: 'removeSubscription' }),
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  branch(
    ({ getUserToken: { loggedInUser } }) => {
      if (loggedInUser) {
        return !(loggedInUser.role.accessPermission & roleCapabilities.write_subscriptions.value);
      }
      return false;
    },
    graphql(GET_ACTIVE_SUBSCRIPTION, { name: 'getActiveSubscription' }),
  ),
  branch(
    ({ getActiveSubscription }) => !getActiveSubscription || !(getActiveSubscription.activeSubscription),
    renderNothing
  ),
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
  }),
  branch(
    ({ getUserToken: { loggedInUser } }) => {
      if (loggedInUser) {
        const writeSubscriptionPermission = Math.pow(2, 16);
        if (loggedInUser.role.accessPermission & writeSubscriptionPermission) {
          return false;
        }
      }
      return true;
    },
    renderComponent(AdminContentSubscriptionMemberComponent)
  )
)(AdminContentSubscriptionComponent);