import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import {
  ContentHeaderTitleStyled,
  MarginLeftButtonStyled
} from '../../../shared/components';
import { BoxWrapper, BoxBody } from '../../../shared/boxWrapper';
import Breadcrumb from '../../../shared/breadcrumb';
import FontAwesome from '@fortawesome/react-fontawesome';
// import SortableTree from 'react-sortable-tree';
// import 'react-sortable-tree/style.css';

const AdminContentPostsComponent = ({ match, breadcrumbItems }) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Posts</span>
        <Link to={`${match.url}/add-new`}>
          <MarginLeftButtonStyled color="primary" size="sm">
            <FontAwesome icon="plus" /> Add new post
          </MarginLeftButtonStyled>
        </Link>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <BoxWrapper color="primary" title="List Posts">
        <BoxBody>
        </BoxBody>
      </BoxWrapper>
    </ContentBody>
  </ContentContainer>
);

export default compose(
  withRouter
)(AdminContentPostsComponent);

// export default class AdminContentPostsComponent extends React.Component {
//   static propTypes = {
//     title: PropTypes.string.isRequired,
//     href: PropTypes.string.isRequired
//   }

//   constructor(props) {
//     super(props);

//     this.state = {
//       message: '',
//       searchString: '',
//       searchFocusIndex: 0,
//       searchFoundCount: null,
//       treeData: [
//         {
//           title: (
//             <InlineFormEditor text='Test' />
//           ),
//           children: [
//             {
//               title: 'Child Node'
//             },
//             {
//               title: 'Nested structure is rendered virtually'
//             },
//           ],
//         },
//         {
//           expanded: true,
//           title: 'Any node can be the parent or child of any other node',
//           children: [
//             {
//               expanded: true,
//               title: 'Chicken',
//               children: [{ title: 'Egg' }],
//             },
//           ],
//         },
//         {
//           title: 'Button(s) can be added to the node',
//         }
//       ],
//     };
//   }

//   renderRow = (item, index) => {
//     return (
//       <tr key={index}>
//         <td>{index + 1}</td>
//         <td>{item.title}</td>
//         <td>{item.author}</td>
//         <td>{item.categories.join(' ,')}</td>
//         <td>{item.thumbnail}</td>
//         <td>{item.date.format('DD/MM/YYYY')}</td>
//       </tr>
//     );
//   }

//   generateNodeProps = () => {
//     return {
//       buttons: [
//         <Button color="link" key={1}>
//           <FontAwesome icon='plus' />
//         </Button>,
//         <Button color="link" className={styles.btnRemoveCategory} key={2}>
//           <FontAwesome icon='trash' />
//         </Button>
//       ]
//     };
//   }
  
//   render() {
//     const { title } = this.props;
//     return (
      
//     );
//   }
// }