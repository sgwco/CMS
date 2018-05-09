import { compose, withProps, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentPostsComponent from '../../../components/admin/admin-content/admin-content-posts';
import { ALERT_STATUS } from '../../../utils/enum';
import { GET_FULL_POSTS, REMOVE_POST } from '../../../utils/graphql';

export default compose(
  graphql(GET_FULL_POSTS, { name: 'getPosts' }),
  graphql(REMOVE_POST, { name: 'removePost' }),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Posts' }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    onRemovePost: ({ removePost, setAlertContent, setAlert }) => async id => {
      const result = confirm('Do you want to remove this post?');
      if (result) {
        try {
          await removePost({
            variables: { id },
            optimisticResponse: {
              __typename: 'Mutation',
              removePost: {
                __typename: 'String',
                id
              }
            },
            update(cache, { data: { removePost } }) {
              let { posts } = cache.readQuery({ query: GET_FULL_POSTS });
              posts = posts.filter(item => item.id !== removePost);
              cache.writeQuery({ query: GET_FULL_POSTS, data: { posts } });
            }
          });

          setAlertContent('Remove post successfully');
          setAlert(ALERT_STATUS.SUCCESS);
        }
        catch (e) {
          setAlertContent('Error: ' + e.graphQLErrors[0].message);
          setAlert(ALERT_STATUS.ERROR);
        }
      }
    }
  })
)(AdminContentPostsComponent);