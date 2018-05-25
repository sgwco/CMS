import { compose, branch, withProps, withState, withHandlers, renderNothing } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';
import moment from 'moment';
import _ from 'lodash';

import { EDIT_PACKAGE, GET_ALL_PACKAGES, CREATE_PACKAGE, GET_FULL_USERS, GET_USER_TOKEN, GET_SETTINGS } from '../../../utils/graphql';
import { ALERT_STATUS, ROLE_CAPABILITIES, SETTING_KEYS } from '../../../utils/enum';
import AdminContentPackageFormComponent from '../../../components/admin/admin-content/admin-content-package-form';
import { checkRoleIsAllowed } from '../../../utils/utils';
import lang from '../../../languages';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  graphql(GET_SETTINGS, { name: 'getSettings' }),
  branch(
    ({ getSettings: { settings }}) => !settings,
    renderNothing
  ),
  branch(
    ({getUserToken: { loggedInUser = {} }}) =>
      _.isEmpty(loggedInUser) || !checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.read_packages.value),
    renderNothing
  ),
  withApollo,
  withRouter,
  branch(
    ({ isEditedPackage }) => isEditedPackage,
    graphql(EDIT_PACKAGE, { name: 'editPackage' }),
    graphql(CREATE_PACKAGE, { name: 'createPackage' })
  ),
  graphql(GET_FULL_USERS, { name: 'getUsers' }),
  withProps(({ getSettings: { settings = [] }}) => ({
    language: (settings.find(item => item.settingKey === SETTING_KEYS.LANGUAGE) || {}).settingValue
  })),
  withHandlers({
    renderTopTitle: ({ isEditedPackage, language }) => () =>
      isEditedPackage ? `${lang('edit', language)} ${lang('package', language)}` : `${lang('add_new', language)} ${lang('package', language)}`
  }),
  withProps(({ renderTopTitle, language }) => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: lang('home', language) },
      { url: '/admin/package', icon: 'briefcase', text: lang('packages', language) },
      { text: renderTopTitle() }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    savePackage: ({ isEditedPackage, match, editPackage, createPackage, setAlertContent, setAlert }) => async (data) => {
      try {
        const variables = Object.assign({}, data);
        const optimisticData = {
          __typename: 'Package',
          packageId: variables.packageId,
          user: {
            __typename: 'User',
            username: '-',
            fullname: '-'
          },
          introducer: {
            __typename: 'User',
            username: '-',
            fullname: '-'
          },
          price: variables.price,
          duration: variables.duration,
          registerDate: variables.registerDate
        };
    
        if (isEditedPackage) {
          variables.id = match.params.id;
          await editPackage({
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              editPackage: optimisticData
            },
            update(cache, { data: { editPackage } }) {
              try {
                const { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
                const index = packages.findIndex(item => item.id === match.params.id);
                packages[index] = editPackage;
                cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });

          setAlertContent('Edit package successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        else {
          await createPackage({
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              createPackage: optimisticData
            },
            update(cache, { data: { createPackage } }) {
              try {
                const { packages } = cache.readQuery({ query: GET_ALL_PACKAGES });
                packages.push(createPackage);
                cache.writeQuery({ query: GET_ALL_PACKAGES, data: { packages } });
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
        setAlertContent('Error: ' + e.graphQLErrors[0].message || e.message);
        setAlert(ALERT_STATUS.ERROR);
      }
    },
    initValue: ({ isEditedPackage, client, history, match }) => (formApi) => {
      if (isEditedPackage) {
        try {
          const { packages } = client.cache.readQuery({ query: GET_ALL_PACKAGES });
          const packageItem = packages.find(item => item.id === match.params.id);

          formApi.setValue('userId', packageItem.user.id);
          formApi.setValue('price', packageItem.price);
          formApi.setValue('duration', packageItem.duration);
          formApi.setValue('registerDate', moment(packageItem.registerDate).format('DD/MM/YYYY'));
        }
        catch (e) {
          history.push('/admin/package');
        }
      }
    }
  }),
)(AdminContentPackageFormComponent);