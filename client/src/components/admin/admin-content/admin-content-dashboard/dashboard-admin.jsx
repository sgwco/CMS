import React from 'react';
import { Row, Col } from 'reactstrap';
import { Pie, Bar } from 'react-chartjs-2';
import { FormattedMessage } from 'react-intl';

import { BoxWrapper, BoxBody } from '../../../../shared/boxWrapper';
import { CardboardItem } from '../../../../shared/components';

const DashboardAdmin = ({
  listPackages: { packages = [] },
  getUsers: { users = [] },
  pieChartData,
  barData,
  currentYear,
  intl
}) => (
  Object.keys(packages).length > 0 && (
    <div>
      <Row>
        <Col md={3}>
          <CardboardItem
            color='yellow'
            title={<FormattedMessage id="categories.packages" />}
            content={packages.length}
            icon='briefcase'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='aqua'
            title={<FormattedMessage id="categories.users" />}
            content={users.length}
            icon='user'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='green'
            title={<FormattedMessage id="dashboard_page.total_price" />}
            content={`${(packages.reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND`}
            icon='money-bill-alt'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='red'
            title={<FormattedMessage id="dashboard_page.total_active_price" />}
            content={`${(packages.filter(item => item.status === 'ACTIVE').reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND`}
            icon='money-bill-alt'
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <BoxWrapper color="success" title={<FormattedMessage id="categories.packages" />}>
            <BoxBody>
              <Pie data={pieChartData} />
            </BoxBody>
          </BoxWrapper>
        </Col>
        <Col lg={6}>
          <BoxWrapper color="primary" title={<FormattedMessage id="dashboard_page.total_price_in_year" values={{ year: currentYear }} />}>
            <BoxBody>
              <Bar data={barData} options={{
                scales: {
                  xAxes: [{
                    ticks: {
                      callback(tickValue) {
                        return intl.messages[`month.${tickValue}`];
                      }
                    }
                  }],
                  yAxes: [{
                    ticks: {
                      callback(tickValue) {
                        return intl.formatNumber(tickValue);
                      }
                    }
                  }]
                },
                tooltips: {
                  callbacks: {
                    label: (item, data) => intl.formatNumber(data['datasets'][item.datasetIndex]['data'][item.index]) + ' VND'
                  }
                }
              }} />
            </BoxBody>
          </BoxWrapper>
        </Col>
      </Row>
    </div>
  )
);

export default DashboardAdmin;