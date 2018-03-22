import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Row, Col } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';
// import styles from './admin-content-posts.css';

import DataTable from '../../../../commons/dataTable';
import { contentPost } from '../../../../data';

export default class AdminContentPostsComponent extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired
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
                  <DataTable striped bordered hover
                    header={contentPost.header}
                    data={contentPost.data} />
                </div>
              </div>
            </Col>
            <Col lg="3" md="12">
              <div className="box">
                <div className="box-header">
                  <div className="box-title">Categories</div>
                </div>
                <div className="box-body">
                  
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </div>
    );
  }
}