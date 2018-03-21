import React from 'react';
// import styles from './admin-content.css';

export default class AdminContentComponent extends React.Component {
  render() {
    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            Dashboard
            <small>Control panel</small>
          </h1>
          <ol className="breadcrumb">
            <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
            <li className="active">Dashboard</li>
          </ol>
        </section>

        <section className="content">
        </section>
      </div>
    );
  }
}