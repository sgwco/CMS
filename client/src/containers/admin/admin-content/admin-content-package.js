import { compose, withHandlers, withState, withStateHandlers, withProps, branch, renderNothing } from 'recompose';
import { graphql } from 'react-apollo';
import moment from 'moment';
import { injectIntl } from 'react-intl';
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
  injectIntl,
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin/dashboard', icon: 'home', text: 'categories.home' },
      { text: 'categories.packages' }
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
    onRemovePackage: ({ removePackage, setAlertContent, setAlert, intl }) => async packageId => {
      const result = confirm(intl.messages['question.remove']);
      if (result) {
        try {
          await removePackage({
            variables: { packageId },
            optimisticResponse: {
              __typename: 'Mutation',
              removeUser: {
                __typename: 'String',
                packageId
              }
            },
            update(cache, { data: { removePackage } }) {
              let { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
              packages = packages.filter(item => item.packageId !== removePackage);
              cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
            }
          });

          setAlertContent('success.remove');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent(e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    },
    onDeactivePackage: ({ editPackage, setAlertContent, setAlert, intl }) => async packageId => {
      const result = confirm(intl.messages['question.deactive_package']);
      if (result) {
        try {
          await editPackage({
            variables: {
              packageId,
              status: getKeyAsString(PACKAGE_STATUS.EXPIRED, PACKAGE_STATUS)
            },
            update(cache, { data: { editPackage } }) {
              try {
                const { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
                const index = packages.findIndex(item => item.packageId === packageId);
                packages[index] = editPackage;
                cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });

          setAlertContent('success.deactive_package');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent(e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    },
    onActivePackage: ({ editPackage, setAlertContent, setAlert, intl }) => async packageId => {
      const result = confirm(intl.messages['question.active_package']);
      if (result) {
        try {
          await editPackage({
            variables: {
              packageId,
              status: getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS)
            },
            update(cache, { data: { editPackage } }) {
              try {
                const { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
                const index = packages.findIndex(item => item.packageId === packageId);
                packages[index] = editPackage;
                cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });

          setAlertContent('success.active_package');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent(e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    },
    onUpgradePackage: ({ editPackage, setAlertContent, setAlert }) => async packageId => {
      const result = confirm('question.upgrade_package');
      if (result) {
        try {
          await editPackage({
            variables: {
              packageId,
              duration: getKeyAsString(DURATION_TYPE.MONTH_12, DURATION_TYPE)
            },
            update(cache, { data: { editPackage } }) {
              try {
                const { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
                const index = packages.findIndex(item => item.packageId === packageId);
                packages[index] = editPackage;
                cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });

          setAlertContent('success.upgrade_package');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent(e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    },
    onWithdraw: ({ editPackageProgress, intl }) => async (progressItem) => {
      const result = confirm(intl.messages['question.withdraw']);
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
                const index = packages.findIndex(item => item.packageId === editPackageProgress.packageId);
                packages[index] = editPackageProgress;
                cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });

          alert('success.withdraw');
        }
        catch (e) {
          alert(e.graphQLErrors[0].message);
        }
      }
    },
    packagesNormalizer: ({ getPackages: { packages = [] } }) => () => {
      const packageCloned = _.cloneDeep(packages);
      for (let index = 0; index < packageCloned.length; index++) {
        packageCloned[index].username = packageCloned[index].user.username;
        packageCloned[index].fullname = packageCloned[index].user.fullname;
      }
      return packageCloned;
    }
  })
)(AdminContentPackageComponent);