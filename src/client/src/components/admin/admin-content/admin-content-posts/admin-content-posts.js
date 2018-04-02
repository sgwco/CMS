import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Row, Col, Button, Form, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

import styles from './admin-content-posts.css';
// import DataTable from '../../../../commons/dataTable';
import InlineFormEditor from '../../../../commons/inline-form-editor';
import CategoryNode from '../../../../commons/category-node/category-node';
// import { contentPost } from '../../../../data';

export default class AdminContentPostsComponent extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [
        {
          title: (
            <InlineFormEditor text='Test' />
          ),
          children: [
            {
              title: 'Child Node'
            },
            {
              title: 'Nested structure is rendered virtually'
            },
          ],
        },
        {
          expanded: true,
          title: 'Any node can be the parent or child of any other node',
          children: [
            {
              expanded: true,
              title: 'Chicken',
              children: [{ title: 'Egg' }],
            },
          ],
        },
        {
          title: 'Button(s) can be added to the node',
        }
      ],
    };
  }

  renderRow = (item, index) => {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.title}</td>
        <td>{item.author}</td>
        <td>{item.categories.join(' ,')}</td>
        <td>{item.thumbnail}</td>
        <td>{item.date.format('DD/MM/YYYY')}</td>
      </tr>
    );
  }

  generateNodeProps = () => {
    return {
      buttons: [
        <Button color="link">
          <FontAwesome icon='plus' />
        </Button>,
        <Button color="link" className={styles.btnRemoveCategory}>
          <FontAwesome icon='trash' />
        </Button>
      ]
    };
  }
  
  render() {
    const { title } = this.props;
    return (
      <div>
        <section className="content-header">
          <h1>{title}</h1>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to='/admin'><FontAwesome icon="home" /> Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{title}</BreadcrumbItem>
          </Breadcrumb>
        </section>
        <section className="content">
          <Row>
            <Col lg="9" md="12">
              <div className="box">
                <div className="box-header">
                  <div className="box-title">List {title}</div>
                </div>
                <div className="box-body">
                  {/* <DataTable striped bordered hover
                    header={contentPost.header}
                    data={contentPost.data}
                  /> */}
                </div>
              </div>
            </Col>
            <Col lg="3" md="12">
              <div className="box">
                <div className="box-header">
                  <div className="box-title">Categories</div>
                </div>
                <div className={[styles.boxCategories, 'box-body'].join(' ')}>
                  <Form>
                    <InputGroup>
                      <Input type='text' placeholder='Search...' />
                      <InputGroupAddon addonType='append'>
                        <Button color='primary'>&lt;</Button>
                      </InputGroupAddon>
                      <InputGroupAddon addonType='append'>
                        <Button color='primary'>&gt;</Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Form>
                  <SortableTree
                    treeData={this.state.treeData}
                    onChange={treeData => this.setState({ treeData })}
                    nodeContentRenderer={CategoryNode}
                    generateNodeProps={this.generateNodeProps}
                    className={styles.categoryTree}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </div>
    );
  }
}