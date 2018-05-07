import { compose, withProps, withState, withStateHandlers, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentPostsCategoryComponent from '../../../components/admin/admin-content/admin-content-posts-category';
import { ALERT_STATUS } from '../../../utils/enum';
import { GET_FULL_CATEGORIES, REMOVE_CATEGORY } from '../../../utils/graphql';
export default compose(
  graphql(GET_FULL_CATEGORIES, { name: 'getCategories' }),
  graphql(REMOVE_CATEGORY, { name: 'removeCategory' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Posts' }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    null,
    {
      removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    }
  ),
  withHandlers({
    onRemoveCategory: ({ removeCategory, setAlertContent, setAlert }) => async id => {
      const result = confirm('Do you want to remove this category?');
      if (result) {
        try {
          await removeCategory({
            variables: { id },
            optimisticResponse: {
              __typename: 'Mutation',
              removeCategory: {
                __typename: 'String',
                id
              }
            },
            update(cache, { data: { removeCategory } }) {
              let { categories } = cache.readQuery({ query: GET_FULL_CATEGORIES });
              categories = categories.filter(item => item.id !== removeCategory);
              cache.writeQuery({ query: GET_FULL_CATEGORIES, data: { categories } });
            }
          });

          setAlertContent('Remove category successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent('Error: ' + e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    }
  })
)(AdminContentPostsCategoryComponent);