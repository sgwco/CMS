import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table } from 'reactstrap';

export class DataTable extends React.Component {
  static propTypes = {
    headers: PropTypes.arrayOf(PropTypes.any).isRequired,
    data: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool
  }

  static defaultProps = {
    isLoading: false
  }

  renderHeader = (item, index) => (<th key={index}>{item.title}</th>);

  renderCell = (header, item) => {
    const renderData = item[header];

    if (renderData instanceof Array) {
      return <td key={header}>{renderData.join(', ')}</td>;
    }
    else if (moment.isMoment(renderData)) {
      return <td key={header}>{renderData.format('DD/MM/YYYY')}</td>;
    }
    else {
      return <td key={header}>{renderData}</td>;
    }
  }

  renderRow = item => (
    <tr key={item.id}>
      {this.props.headers.map(header => this.renderCell(header.value, item))}
    </tr>
  );

  render() {
    const { headers, data, isLoading, ...props } = this.props;
    isLoading;
    return (
      <Table {...props}>
        <thead>
          <tr>
            {headers.map(this.renderHeader)}
          </tr>
        </thead>
        <tbody>
          {data.map(this.renderRow)}
        </tbody>
      </Table>
    );
  }
}