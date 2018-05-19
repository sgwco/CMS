import React from 'react';
import { Row, Col } from 'reactstrap';
import { Pie, HorizontalBar } from 'react-chartjs-2';

import { BoxWrapper, BoxBody } from '../../../../shared/boxWrapper';
import { CardboardItem } from '../../../../shared/components';

const DashboardAdmin = ({
  listPackages: { packages = [] },
  getUsers: { users = [] },
  pieChartData,
  barData,
  currentYear
}) => (
  Object.keys(packages).length > 0 && (
    <div>
      <Row>
        <Col md={3}>
          <CardboardItem
            color='yellow'
            title='Package(s)'
            content={packages.length}
            icon='briefcase'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='aqua'
            title='User(s)'
            content={users.length}
            icon='user'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='green'
            title='Total Price'
            content={`${(packages.reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND`}
            icon='money-bill-alt'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='red'
            title='Total Price of Active Package(s)'
            content={`${(packages.filter(item => item.status === 'ACTIVE').reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND`}
            icon='money-bill-alt'
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <BoxWrapper color="success" title="Packages">
            <BoxBody>
              <Pie data={pieChartData} />
            </BoxBody>
          </BoxWrapper>
        </Col>
        <Col lg={6}>
          <BoxWrapper color="primary" title={`Total price in ${currentYear}`}>
            <BoxBody>
              <HorizontalBar data={barData} options={{
                scales: {
                  xAxes: [{
                    ticks: {
                      callback(tickValue) {
                        return tickValue.toLocaleString('vi');
                      }
                    }
                  }]
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