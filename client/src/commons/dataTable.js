import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table } from 'reactstrap';

export default class DataTable extends React.Component {
  static propTypes = {
    header: PropTypes.objectOf(PropTypes.any).isRequired,
    data: PropTypes.arrayOf(PropTypes.any).isRequired
  }

  renderHeader = (key, index) => {
    const { header } = this.props;
    return (<th key={index}>{header[key]}</th>);
  }

  renderCell = (data, index) => {
    if (typeof data === 'string') {
      return <td key={index}>{data}</td>;
    }
    if (data instanceof Array) {
      return <td key={index}>{data.join(', ')}</td>;
    }
    if (moment.isMoment(data)) {
      return <td key={index}>{data.format('DD/MM/YYYY')}</td>;
    }
  }

  renderRow = (item, index) => {
    const { header } = this.props;
    const parsedHeader = Object.keys(header);

    return (
      <tr key={index}>
        {parsedHeader.map((key, idx) => this.renderCell(item[key], idx))}
      </tr>
    );
  }

  render() {
    const { header, data, ...props } = this.props;
    if (data.length > 0) {
      const parsedHeader = Object.keys(header);
      return (
        <Table {...props}>
          <thead>
            <tr>
              {parsedHeader.map(this.renderHeader)}
            </tr>
          </thead>
          <tbody>
            {data.map(this.renderRow)}
          </tbody>
        </Table>
      );
    }

    return null;
  }
}