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

export const ListCardboard = ({ selectedPackage }) => (
  <Row>
    <Col md={6}>
      <DivBox className="small-box bg-aqua">
        <div className="inner">
          <h3>Package</h3>
          <p>{selectedPackage.price} {selectedPackage.currency}</p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="shopping-bag" />
        </DivIcon>
      </DivBox>
    </Col>
    <Col md={6}>
      <DivBox className="small-box bg-green">
        <div className="inner">
          <h4>Thời gian bắt đầu:</h4>
          <p>Ngày: </p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="calendar-alt" />
        </DivIcon>
      </DivBox>
    </Col>
    <Col md={6}>
      <DivBox className="small-box bg-yellow">
        <div className="inner">
          <h4>Lợi nhuận ngày: </h4>
          <p>Tiền: </p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="chart-line" />
        </DivIcon>
      </DivBox>
    </Col>
    <Col md={6}>
      <DivBox className="small-box bg-purple">
        <div className="inner">
          <h4>Thời gian nhận lãi: </h4>
          <p>Theo: </p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="chart-pie" />
        </DivIcon>
      </DivBox>
    </Col>
  </Row>
);