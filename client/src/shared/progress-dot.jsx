import React from 'react';
import Steps, { Step } from 'rc-steps';
import { Button } from 'reactstrap';
import styled from 'styled-components';
import moment from 'moment';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import lang from '../languages';

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

const ProgressStep = ({ progressItem, onWithdraw, currency, language }) => (
  <ProgressStepWrapper>
    <div><strong>{lang('interest_rate', language)}:</strong> {progressItem.interestRate}%</div>
    <div><strong>{lang('payment', language)}:</strong> {progressItem.amount.toLocaleString('vi')}.000 {currency}</div>
    {moment() >= moment(progressItem.date) && !progressItem.status && onWithdraw && (
      <div>
        <Button color='primary' size='sm' onClick={() => onWithdraw(progressItem)}>{lang('withdraw', language)}</Button>
      </div>
    )}
    {progressItem.status && (
      <div>{lang('paid_at', language)} {moment(progressItem.withdrawDate).format('DD/MM/YYYY')}</div>
    )}
  </ProgressStepWrapper>
);

const ProgressDot = ({ selectedPackage, onWithdraw, language }) => (
  <ProgressDotWrapped>
    <Steps labelPlacement="vertical" current={(selectedPackage.transferMoney || []).filter(item => item.status).length + 1}>
      <StepStyled
        title={moment(selectedPackage.registerDate).format('DD/MM/YYYY')}
      />
      {(selectedPackage.transferMoney || []).map(item => (
        <StepStyled
          key={item.id} id={`id_${item.id}`}
          title={moment(item.date).format('DD/MM/YYYY')}
          description={<ProgressStep currency={selectedPackage.currency} progressItem={item} onWithdraw={onWithdraw} language={language} />}
        />
      ))}
    </Steps>
  </ProgressDotWrapped>
);

export default ProgressDot;