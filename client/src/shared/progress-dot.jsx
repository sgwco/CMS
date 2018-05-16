import React from 'react';
import Steps, { Step } from 'rc-steps';
import { Button } from 'reactstrap';
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

const ProgressStepWrapper = styled.div`
  text-align: center;
`;

const ProgressStep = ({ progressItem, onWithdraw, currency }) => (
  <ProgressStepWrapper>
    <div><strong>Interest Rate:</strong> {progressItem.interestRate}%</div>
    <div><strong>Payment:</strong> {progressItem.amount.toLocaleString('vi')}.000 {currency}</div>
    {moment() >= moment(progressItem.date) && !progressItem.status && onWithdraw && (
      <div>
        <Button color='primary' size='sm' onClick={() => onWithdraw(progressItem)}>Withdraw</Button>
      </div>
    )}
    {progressItem.status && (
      <div>Paid at {moment(progressItem.withdrawDate).format('DD/MM/YYYY')}</div>
    )}
  </ProgressStepWrapper>
);

const ProgressDot = ({ selectedPackage, onWithdraw }) => (
  <ProgressDotWrapped>
    <Steps labelPlacement="vertical" current={(selectedPackage.transferMoney || []).filter(item => item.status).length}>
      {(selectedPackage.transferMoney || []).map(item => (
        <StepStyled
          key={item.id} id={`id_${item.id}`}
          title={moment(item.date).format('DD/MM/YYYY')}
          description={<ProgressStep currency={selectedPackage.currency} progressItem={item} onWithdraw={onWithdraw} />}
        />
      ))}
    </Steps>
  </ProgressDotWrapped>
);

export default ProgressDot;