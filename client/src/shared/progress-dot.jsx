import React from 'react';
import Steps, { Step } from 'rc-steps';
import { Button } from 'reactstrap';
import styled from 'styled-components';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

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
    <div><strong><FormattedMessage id='interest_rate' />:</strong> {progressItem.interestRate}%</div>
    <div><strong><FormattedMessage id='payment' />:</strong> {(progressItem.amount * 1000).toLocaleString('vi')} {currency}</div>
    {moment() >= moment(progressItem.date) && !progressItem.status && onWithdraw && (
      <div>
        <Button color='primary' size='sm' onClick={() => onWithdraw(progressItem)}>
          <FormattedMessage id='withdraw' />
        </Button>
      </div>
    )}
    {progressItem.status && (
      <div><FormattedMessage id='paid_at' /> {moment(progressItem.withdrawDate).format('DD/MM/YYYY')}</div>
    )}
  </ProgressStepWrapper>
);

const ProgressDot = ({ selectedPackage, onWithdraw }) => (
  <ProgressDotWrapped>
    <Steps labelPlacement="vertical" current={(selectedPackage.transferMoney || []).filter(item => item.status).length + 1}>
      <StepStyled
        title={moment(selectedPackage.registerDate).format('DD/MM/YYYY')}
      />
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