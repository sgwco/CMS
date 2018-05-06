import React from 'react';
import Steps, { Step } from 'rc-steps';
import styled from 'styled-components';
import moment from 'moment';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';

const ProgressDotWrapped = styled.div`
  margin-top: 10px;
`;

const StepStyled = styled(Step)`
  .rc-steps-icon {
    top: 6px !important;
  }
`;

const ProgressDot = ({ transferMoneyItems = [] }) => (
  <ProgressDotWrapped>
    <Steps labelPlacement="vertical" current={transferMoneyItems.filter(item => item.status).length}>
      {transferMoneyItems.map(item => (
        <StepStyled
          key={item.id} id={`id_${item.id}`}
          title={`Withdraw in ${moment(item.date).format('DD/MM/YYYY')}`}
        />
      ))}
    </Steps>
  </ProgressDotWrapped>
);

export default ProgressDot;