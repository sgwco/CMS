import { compose, branch, withProps, withState, withStateHandlers, withHandlers } from 'recompose';
import { graphql, withApollo } from 'react-apollo';

import { ALERT_STATUS } from '../../../utils/enum';
import AdminContentPostsCategoryFormComponent from '../../../components/admin/admin-content/admin-content-posts-category-form';

import { CREATE_CATEGORY, EDIT_CATEGORY, GET_FULL_CATEGORIES } from '../../../utils/graphql';

export default compose(
  withApollo,
  branch(
    ({ isEditedUser }) => !isEditedUser,
    graphql(CREATE_CATEGORY, { name: 'createCategory' }),
    graphql(EDIT_CATEGORY, { name: 'editCategory' })
  ),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withStateHandlers(
    null,
    {
      removeAlert: () => () => ({ alertVisible: ALERT_STATUS.HIDDEN }),
    }
  ),
  withHandlers({
    renderTopTitle: ({ isEditedUser }) => () => isEditedUser ? 'Edit Category' : 'Add New Category',
    submitForm: ({ createCategory, setAlertContent, setAlert, isEditedUser, editCategory, match }) => async (data) => {
      try {
        if(isEditedUser){
          data.id = match.params.id;
          await editCategory({
            variables: data,
            optimisticResponse: {
              __typename: 'Mutation',
              editCategory: {
                __typename: 'Category',
                id: Math.round(Math.random() * -1000000),
                name: data.name,
                slug: data.slug || '',
                parent: data.parent || '',
                description: data.description || '',
                thumbnail: data.thumbnail || ''
              }
            },
            update(cache, { data: { editCategory } }) {
              try {
                const { categories } = cache.readQuery({ query: GET_FULL_CATEGORIES });
                const index = categories.findIndex(item => item.id === match.params.id);
                categories[index] = editCategory;
                cache.writeQuery({ query: GET_FULL_CATEGORIES, data: { categories } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });
          setAlertContent('Edit Category successfully!');
          setAlert(ALERT_STATUS.SUCCESS);
        } 
        else {
          await createCategory ({
            variables: data,
            optimisticResponse: {
              __typename: 'Mutation',
              createCategory: {
                __typename: 'Category',
                id: Math.round(Math.random() * -1000000),
                name: data.name,
                slug: data.slug || '',
                parent: data.parent || '',
                description: data.description || '',
                thumbnail: data.thumbnail || ''
              }
            },
            update(cache, { data: { createCategory } }) {
              try {
                const { categories } = cache.readQuery({ query: GET_FULL_CATEGORIES });
                categories.push(createCategory);
                cache.writeQuery({ query: GET_FULL_CATEGORIES, data: { categories } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });
          setAlertContent('Add Category successfully!');
          setAlert(ALERT_STATUS.SUCCESS);
        }
      } 
      catch (e) {
        console.log(e.graphQLErrors);
        setAlertContent('Error: ' + e.graphQLErrors[0].message);
        setAlert(ALERT_STATUS.ERROR);
      }
    },
    initValue: ({ isEditedUser, client, history, match }) => (formApi) => {
      if (isEditedUser) {
        try {
          const { categories } = client.cache.readQuery({ query: GET_FULL_CATEGORIES });
          const category = categories.find(item => item.id === match.params.id);

          formApi.setValue('name', category.name);
          formApi.setValue('slug', category.slug);
          formApi.setValue('parent', category.parnet);
          formApi.setValue('description', category.description); 
          formApi.setValue('thumbnail', category.thumbnail);

        }
        catch (e) {
          history.push('/admin/post/category');
        }
      }
    }
  }),
  withProps(({ renderTopTitle }) => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { url: '/admin/post', icon: 'file', text: 'Posts' },
      { text: renderTopTitle() }
    ]
  }))
)(AdminContentPostsCategoryFormComponent);