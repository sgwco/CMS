import React from 'react';
import { Row, Col } from 'reactstrap';

import { ListCardboard } from './cardboard';

const DashboardMember = ({ selectedPackage }) => (
  <Row>
    <Col lg={6}>
      <ListCardboard selectedPackage={selectedPackage} />
    </Col>
  </Row>
);

export default DashboardMember;