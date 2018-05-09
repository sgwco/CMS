import { compose, withHandlers, withState, withStateHandlers, withProps, branch, renderNothing } from 'recompose';
import { graphql } from 'react-apollo';
import moment from 'moment';
import _ from 'lodash';

import AdminContentPackageComponent from '../../../components/admin/admin-content/admin-content-package';
import { ALERT_STATUS, PACKAGE_STATUS, DURATION_TYPE, ROLE_CAPABILITIES } from '../../../utils/enum';
import { GET_ALL_PACKAGES, REMOVE_PACKAGE, EDIT_PACKAGE, EDIT_PACKAGE_PROGRESS, GET_USER_TOKEN } from '../../../utils/graphql';
import { getKeyAsString, checkRoleIsAllowed } from '../../../utils/utils';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  branch(
    ({getUserToken: { loggedInUser = {} }}) =>
      _.isEmpty(loggedInUser) || !checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.read_packages.value),
    renderNothing
  ),
  graphql(GET_ALL_PACKAGES, { name: 'getPackages' }),
  graphql(EDIT_PACKAGE, { name: 'editPackage' }),
  graphql(REMOVE_PACKAGE, { name: 'removePackage' }),
  graphql(EDIT_PACKAGE_PROGRESS, { name: 'editPackageProgress' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Packages' }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    ({ selectedPackageIndex = -1 }) => ({ selectedPackageIndex }),
    {
      toggleDetailModal: () => (selectedPackageIndex = -1) => ({ selectedPackageIndex })
    }
  ),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    onRemovePackage: ({ removePackage, setAlertContent, setAlert }) => async id => {
      const result = confirm('Do you want to remove this package?');
      if (result) {
        try {
          await removePackage({
            variables: { id },
            optimisticResponse: {
              __typename: 'Mutation',
              removeUser: {
                __typename: 'String',
                id
              }
            },
            update(cache, { data: { removePackage } }) {
              let { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
              packages = packages.filter(item => item.id !== removePackage);
              cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
            }
          });

          setAlertContent('Remove package successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent('Error: ' + e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    },
    onDeactivePackage: ({ editPackage, setAlertContent, setAlert }) => async id => {
      const result = confirm('Do you want to deactive this package?');
      if (result) {
        try {
          await editPackage({
            variables: {
              id,
              status: getKeyAsString(PACKAGE_STATUS.EXPIRED, PACKAGE_STATUS)
            },
            update(cache, { data: { editPackage } }) {
              try {
                const { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
                const index = packages.findIndex(item => item.id === id);
                packages[index] = editPackage;
                cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });

          setAlertContent('Deactive package successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent('Error: ' + e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    },
    onActivePackage: ({ editPackage, setAlertContent, setAlert }) => async id => {
      const result = confirm('Do you want to active this package?');
      if (result) {
        try {
          await editPackage({
            variables: {
              id,
              status: getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS)
            },
            update(cache, { data: { editPackage } }) {
              try {
                const { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
                const index = packages.findIndex(item => item.id === id);
                packages[index] = editPackage;
                cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });

          setAlertContent('Active package successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent('Error: ' + e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    },
    onUpgradePackage: ({ editPackage, setAlertContent, setAlert }) => async id => {
      const result = confirm('Do you want to upgrade this package duration to 12 months?');
      if (result) {
        try {
          await editPackage({
            variables: {
              id,
              duration: getKeyAsString(DURATION_TYPE.MONTH_12, DURATION_TYPE)
            },
            update(cache, { data: { editPackage } }) {
              try {
                const { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
                const index = packages.findIndex(item => item.id === id);
                packages[index] = editPackage;
                cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });

          setAlertContent('Upgrade package successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent('Error: ' + e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    },
    onWithdraw: ({ editPackageProgress }) => async (progressItem) => {
      const result = confirm(`Do you want to withdraw this package at ${moment(progressItem.date).format('DD/MM/YYYY')}?`);
      if (result) {
        try {
          await editPackageProgress({
            variables: {
              id: progressItem.id,
              withdrawDate: moment().format('DD/MM/YYYY'),
              status: true
            },
            update(cache, { data: { editPackageProgress } }) {
              try {
                const { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
                const index = packages.findIndex(item => item.id === editPackageProgress.id);
                packages[index] = editPackageProgress;
                cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });

          alert('Withdraw successfully!');
        }
        catch (e) {
          alert('Error: ' + e.graphQLErrors[0].message);
        }
      }
    }
  })
)(AdminContentPackageComponent);