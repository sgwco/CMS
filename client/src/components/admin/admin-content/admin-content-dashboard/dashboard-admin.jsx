import React from 'react';
import { Row, Col } from 'reactstrap';
import { Pie, HorizontalBar } from 'react-chartjs-2';

import { BoxWrapper, BoxBody } from '../../../../shared/boxWrapper';
import { CardboardItem } from '../../../../shared/components';
import lang from '../../../../languages';

const DashboardAdmin = ({
  listPackages: { packages = [] },
  getUsers: { users = [] },
  pieChartData,
  barData,
  currentYear,
  language
}) => (
  Object.keys(packages).length > 0 && (
    <div>
      <Row>
        <Col md={3}>
          <CardboardItem
            color='yellow'
            title={lang('packages', language)}
            content={packages.length}
            icon='briefcase'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='aqua'
            title={lang('users', language)}
            content={users.length}
            icon='user'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='green'
            title={lang('total_price', language)}
            content={`${(packages.reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND`}
            icon='money-bill-alt'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='red'
            title={lang('total_price_active_packages', language)}
            content={`${(packages.filter(item => item.status === 'ACTIVE').reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND`}
            icon='money-bill-alt'
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <BoxWrapper color="success" title={lang('packages', language)}>
            <BoxBody>
              <Pie data={pieChartData} />
            </BoxBody>
          </BoxWrapper>
        </Col>
        <Col lg={6}>
          <BoxWrapper color="primary" title={`${lang('total_price_in', language)} ${currentYear}`}>
            <BoxBody>
              <HorizontalBar data={barData} options={{
                scales: {
                  xAxes: [{
                    ticks: {
                      callback(tickValue) {
                        return tickValue.toLocaleString('vi');
                      }
                    }
                  }],
                  yAxes: [{ stacked: true }]
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