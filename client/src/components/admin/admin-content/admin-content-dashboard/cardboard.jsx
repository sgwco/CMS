import React from 'react';
import { Row, Col } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import moment from 'moment';
import { DURATION_TYPE } from '../../../../utils/enum';

const DivBox = styled.div`
  min-height: 150px;
`;
const DivIcon = styled.div`
  top: 10px !important;
`;

export const ListCardboard = ({ activePackage }) => (
  <Row>
    <Col md={6}>
      <DivBox className="small-box bg-aqua">
        <div className="inner">
          <h3>{activePackage.price} {activePackage.currency}</h3>
          <p>Package</p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="money-bill-alt" />
        </DivIcon>
      </DivBox>
    </Col>
    <Col md={6}>
      <DivBox className="small-box bg-green">
        <div className="inner">
          <h3>{DURATION_TYPE[activePackage.duration]} Months</h3>
          <p>Package Duration</p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="clock" />
        </DivIcon>
      </DivBox>
    </Col>
    <Col md={6}>
      <DivBox className="small-box bg-yellow">
        <div className="inner">
          <h3>{moment(activePackage.registerDate).format('DD/MM/YYYY')}</h3>
          <p>Registered Date</p>
        </div>
        <DivIcon className="icon">
          <FontAwesome icon="calendar-alt" />
        </DivIcon>
      </DivBox>
    </Col>
  </Row>
);