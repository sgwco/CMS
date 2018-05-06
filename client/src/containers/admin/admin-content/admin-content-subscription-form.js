import { compose, branch, withProps, withState, withStateHandlers, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';

import { EDIT_SUBSCRIPTION, CREATE_SUBSCRIPTION, GET_ALL_SUBSCRIPTIONS, GET_FULL_USERS, GET_ALL_PACKAGES } from '../../../utils/graphql';
import { ALERT_STATUS } from '../../../utils/enum';
import AdminContentSubscriptionFormContainer from '../../../components/admin/admin-content/admin-content-subscription-form';

export default compose(
  withApollo,
  withRouter,
  branch(
    ({ isEditedSubscription }) => isEditedSubscription,
    graphql(EDIT_SUBSCRIPTION, { name: 'editSubscription' }),
    graphql(CREATE_SUBSCRIPTION, { name: 'createSubscription' })
  ),
  graphql(GET_FULL_USERS, { name: 'getUsers' }),
  graphql(GET_ALL_PACKAGES, { name: 'getPackages' }),
  withHandlers({
    renderTopTitle: ({ isEditedSubscription }) => () => isEditedSubscription ? 'Edit Subscription' : 'Add New Subscription',
  }),
  withProps(({ renderTopTitle }) => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { url: '/admin/subscription', icon: 'briefcase', text: 'Subscription' },
      { text: renderTopTitle() }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    null,
    {
      removeAlert: () => () => ({ alertVisible: ALERT_STATUS.HIDDEN }),
    }),
  withHandlers({
    saveSubscription: ({ isEditedSubscription, match, editSubscription, createSubscription, setAlertContent, setAlert }) => async ({ user_id, package_id, duration, subscribeDate, status }) => {
      try {
        const variables = {
          user_id,
          package_id,
          duration,
          subscribeDate,
          status
        };
    
        if (isEditedSubscription) {
          variables.id = match.params.id;
          await editSubscription({
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              editSubscription: {
                __typename: 'Subscription',
                id: Math.round(Math.random() * -1000000),
                user_id,
                package_id,
                duration,
                subscribeDate,
                status
              }
            },
            update(cache, { data: { editSubscription } }) {
              try {
                const { subscriptions } = cache.readQuery({ query: GET_ALL_SUBSCRIPTIONS });
                const index = subscriptions.findIndex(item => item.id === match.params.id);
                subscriptions[index] = editSubscription;
                cache.writeQuery({ query: GET_ALL_SUBSCRIPTIONS, data: { subscriptions } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });
          setAlertContent('Edit subscription successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        else {
          await createSubscription({
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              createSubscription: {
                __typename: 'Subscription',
                id: Math.round(Math.random() * -1000000),
                user_id,
                package_id,
                duration,
                subscribeDate,
                status
              }
            },
            update(cache, { data: { createSubscription } }) {
              try {
                const { subscriptions } = cache.readQuery({ query: GET_ALL_SUBSCRIPTIONS });
                subscriptions.push(createSubscription);
                cache.writeQuery({ query: GET_ALL_SUBSCRIPTIONS, data: { subscriptions } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });
          setAlertContent('Add package successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
      }
      catch (e) {
        setAlertContent('Error: ' + e.graphQLErrors[0].message);
        setAlert(ALERT_STATUS.ERROR);
      }
    },
    initValue: ({ isEditedSubscription, history, client, match }) => (formApi) => {
      if (isEditedSubscription) {
        try {
          const { subscriptions } = client.cache.readQuery({ query: GET_ALL_SUBSCRIPTIONS });
          const subscriptionItem = subscriptions.find(item => item.id === match.params.id);

          formApi.setValue('user_id', subscriptionItem.user_id.id);
          formApi.setValue('package_id', subscriptionItem.package_id.id);
          formApi.setValue('duration', subscriptionItem.duration);
        }
        catch (e) {
          history.push('/admin/subscription');
        }
      }
    }
  }),
)(AdminContentSubscriptionFormContainer);