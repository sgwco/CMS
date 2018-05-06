import { compose, withHandlers, withState, withStateHandlers, withProps } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentPackageComponent from '../../../components/admin/admin-content/admin-content-package';
import { ALERT_STATUS, PACKAGE_STATUS, DURATION_TYPE } from '../../../utils/enum';
import { GET_ALL_PACKAGES, REMOVE_PACKAGE, EDIT_PACKAGE } from '../../../utils/graphql';
import { getKeyAsString } from '../../../utils/utils';

export default compose(
  graphql(GET_ALL_PACKAGES, { name: 'getPackages' }),
  graphql(EDIT_PACKAGE, { name: 'editPackage' }),
  graphql(REMOVE_PACKAGE, { name: 'removePackage' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Packages' }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    ({ detailModalVisible = false, selectedPackage = {} }) => ({ detailModalVisible, selectedPackage }),
    {
      removeAlert: () => () => ({ alertVisible: ALERT_STATUS.HIDDEN }),
      toggleDetailModal: () => (selectedPackage = {}) =>
        ({ detailModalVisible: Object.keys(selectedPackage).length > 0, selectedPackage })
    }
  ),
  withHandlers({
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
    onDeactivePackage: ({ editPackage, setAlertContent, setAlert, toggleDetailModal }) => async id => {
      const result = confirm('Do you want to withdraw this package?');
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
      toggleDetailModal();
    },
    onActivePackage: ({ editPackage, setAlertContent, setAlert, toggleDetailModal }) => async id => {
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
      toggleDetailModal();
    },
    onUpgradePackage: ({ editPackage, setAlertContent, setAlert }) => async id => {
      const result = confirm('Do you want to upgrade this package duration to 12 months?');
      if (result) {
        try {
          await editPackage({
            variables: {
              id,
              duration: getKeyAsString(DURATION_TYPE.MONTH_6_TRANSFER_12, DURATION_TYPE)
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
    }
  })
)(AdminContentPackageComponent);