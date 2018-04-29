import { compose, branch, withProps, withState, withStateHandlers, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';

import { EDIT_PACKAGE, GET_ALL_PACKAGES, CREATE_PACKAGE, GET_FULL_USERS } from '../../../utils/graphql';
import { ALERT_STATUS } from '../../../commons/enum';
import AdminContentPackageFormComponent from '../../../components/admin/admin-content/admin-content-package-form';

export default compose(
  withApollo,
  withRouter,
  branch(
    ({ isEditedPackage }) => isEditedPackage,
    graphql(EDIT_PACKAGE, { name: 'editPackage' }),
    graphql(CREATE_PACKAGE, { name: 'createPackage' })
  ),
  graphql(GET_FULL_USERS, { name: 'getUsers' }),
  withHandlers({
    renderTopTitle: ({ isEditedPackage }) => () => isEditedPackage ? 'Edit Package' : 'Add New Package',
  }),
  withProps(({ renderTopTitle }) => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { url: '/admin/package', icon: 'briefcase', text: 'Packages' },
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
    savePackage: ({ isEditedPackage, match, editPackage, createPackage, setAlertContent, setAlert }) => async ({ name, price, interestRate }) => {
      try {
        const variables = {
          name,
          price,
          interestRate
        };
    
        if (isEditedPackage) {
          variables.id = match.params.id;
          await editPackage({
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              editPackage: {
                __typename: 'Package',
                id: Math.round(Math.random() * -1000000),
                name,
                price,
                interestRate
              }
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
              createPackage: {
                __typename: 'Package',
                id: Math.round(Math.random() * -1000000),
                name,
                price,
                interestRate
              }
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
        setAlertContent('Error: ' + e.graphQLErrors[0].message);
        setAlert(ALERT_STATUS.ERROR);
      }
    },
    initValue: ({ isEditedPackage, client, history, match }) => (formApi) => {
      if (isEditedPackage) {
        try {
          const { packages } = client.cache.readQuery({ query: GET_ALL_PACKAGES });
          const packageItem = packages.find(item => item.id === match.params.id);

          formApi.setValue('name', packageItem.name);
          formApi.setValue('price', packageItem.price);
          formApi.setValue('interestRate', packageItem.interestRate);
        }
        catch (e) {
          history.push('/admin/package');
        }
      }
    }
  }),
)(AdminContentPackageFormComponent);