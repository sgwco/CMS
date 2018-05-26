import { compose, branch, withProps, withState, withHandlers } from 'recompose';
import { graphql, withApollo } from 'react-apollo';
import moment from 'moment';

import { ALERT_STATUS } from '../../../utils/enum';
import AdminContentPostsFormComponent from '../../../components/admin/admin-content/admin-content-posts-form';

import { CREATE_POST, EDIT_POST, GET_FULL_POSTS, GET_FULL_USERS, GET_FULL_CATEGORIES } from '../../../utils/graphql';

export default compose(
  withApollo,
  branch(
    ({ isEditedUser }) => !isEditedUser,
    graphql(CREATE_POST, { name: 'createPost' }),
    graphql(EDIT_POST, { name: 'editPost' })
  ),
  graphql(GET_FULL_USERS, { name: 'getUsers' }),
  graphql(GET_FULL_CATEGORIES, { name: 'getCategories' }),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    renderTopTitle: ({ isEditedUser }) => () => isEditedUser ? 'Edit Post' : 'Add New Post',
    submitForm: ({ createPost, setAlertContent, setAlert, isEditedUser, editPost, match }) => async (data) => {
      try {
        if(isEditedUser){
          data.id = match.params.id;
          await editPost({
            variables: data,
            optimisticResponse: {
              __typename: 'Mutation',
              editPost: {
                __typename: 'Post',
                id: Math.round(Math.random() * -1000000),
                title: data.title,
                content: data.content,
                excerpt: data.excerpt || '',
                author: {
                  __typename: 'Author',
                  fullname: '-'
                },
                slug: data.slug || '',
                category:{
                  __typename: 'Category',
                  name: '_'
                },
                thumbnail: data.thumbnail || '',
                count: data.count || '',
                publishDate: moment().format('YYYY-MM-DD HH:MM')
              }
            },
            update(cache, { data: { editPost } }) {
              try {
                const { posts } = cache.readQuery({ query: GET_FULL_POSTS });
                const index = posts.findIndex(item => item.id === match.params.id);
                posts[index] = editPost;
                cache.writeQuery({ query: GET_FULL_POSTS, data: { posts } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });
          setAlertContent('Edit Post successfully!');
          setAlert(ALERT_STATUS.SUCCESS);
        } 
        else {
          await createPost ({
            variables: data,
            optimisticResponse: {
              __typename: 'Mutation',
              createPost: {
                __typename: 'Post',
                id: Math.round(Math.random() * -1000000),
                title: data.title,
                content: data.content,
                excerpt: data.excerpt || '',
                author: {
                  __typename: 'Author',
                  fullname: '-'
                },
                slug: data.slug || '',
                category:{
                  __typename: 'Category',
                  name: '_'
                },
                thumbnail: data.thumbnail || '',
                count: data.count || '',
                publishDate: moment().format('YYYY-MM-DD HH:MM')
              }
            },
            update(cache, { data: { createPost } }) {
              try {
                const { posts } = cache.readQuery({ query: GET_FULL_POSTS });
                posts.push(createPost);
                cache.writeQuery({ query: GET_FULL_POSTS, data: { posts } });
              }
              catch (e) {
                // Nothing here
              }
            }
          });
          setAlertContent('Add Post successfully!');
          setAlert(ALERT_STATUS.SUCCESS);
        }
      } 
      catch (e) {
        setAlertContent(e.graphQLErrors[0].message);
        setAlert(ALERT_STATUS.ERROR);
      }
    },
    initValue: ({ isEditedUser, client, history, match }) => (formApi) => {
      if (isEditedUser) {
        try {
          const { posts } = client.cache.readQuery({ query: GET_FULL_POSTS });
          const post = posts.find(item => item.id === match.params.id);

          formApi.setValue('title', post.title);
          formApi.setValue('content', post.content);
          formApi.setValue('excerpt', post.excerpt);
          formApi.setValue('author', post.author.id); 
          formApi.setValue('slug', post.slug);
          formApi.setValue('category', post.category.id);
          formApi.setValue('thumbnail', post.thumbnail);
          formApi.setValue('count', post.count);

        }
        catch (e) {
          history.push('/admin/post');
        }
      }
    }
  }),
  withProps(({ renderTopTitle }) => ({
    breadcrumbItems: [
      { url: '/admin/dashboard', icon: 'home', text: 'Home' },
      { url: '/admin/post', icon: 'file', text: 'Posts' },
      { text: renderTopTitle() }
    ]
  }))
)(AdminContentPostsFormComponent);