import React from 'react';
import { Row, Col } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const DivBox = styled.div`
  min-height: 150px;
`;
const DivIcon = styled.div`
  top: 10px !important;
`;

export const ListCardboard = ({ activePackage }) => (
  <Row>
    <Col md={3}>
      <DivBox className="small-box bg-yellow">
        <div className="inner">
          <h3>{activePackage.length}</h3>
          <p>Package(s)</p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="briefcase" />
        </DivIcon>
      </DivBox>
    </Col>
    <Col md={3}>
      <DivBox className="small-box bg-green">
        <div className="inner">
          <h3>{(activePackage.reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND</h3>
          <p>Total Amount</p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="money-bill-alt" />
        </DivIcon>
      </DivBox>
    </Col>
    <Col md={3}>
      <DivBox className="small-box bg-aqua">
        <div className="inner">
          <h3>{activePackage.filter(item => item.status === 'ACTIVE').length}</h3>
          <p>Active Package(s)</p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="briefcase" />
        </DivIcon>
      </DivBox>
    </Col>
    <Col md={3}>
      <DivBox className="small-box bg-red">
        <div className="inner">
          <h3>{(activePackage.filter(item => item.status === 'ACTIVE').reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND</h3>
          <p>Total Amount of Active Package(s)</p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="money-bill-alt" />
        </DivIcon>
      </DivBox>
    </Col>
  </Row>
);