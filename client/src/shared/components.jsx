import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';
import styled, { keyframes } from 'styled-components';

export const FunctionCell = ({ url, onDelete }) => (
  <FunctionWrapperStyled>
    <Link to={url}>
      <Button color="warning">
        <FontAwesome icon='edit' className="text-white" />
      </Button>
    </Link>
    <Button color="danger" onClick={onDelete}>
      <FontAwesome icon='trash' className="text-white" />
    </Button>
  </FunctionWrapperStyled>
);

const loadingIndicatorCommonContent = `
  position: absolute;
  width: 170px;
  height: 170px;
  border: 30px solid #ff708e;
  border-top-color: transparent;
  border-radius: 50%;
`;

const loadingKeyframes = keyframes`
  0% {
    -webkit-transform: translate(-50%, -50%) rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    -webkit-transform: translate(-50%, -50%) rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const LoadingIndicatorWrapper = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
`;

const LoadingIndicatorRolling = styled.div`
  width: 50px !important;
  height: 50px !important;
  -webkit-transform: translate(-25px, -25px) scale(0.25) translate(25px, 25px);
  transform: translate(-25px, -25px) scale(0.25) translate(25px, 25px);
`;

const LoadingIndicatorContent = styled.div`
  ${loadingIndicatorCommonContent}
  -webkit-animation: ${loadingKeyframes} 1s linear infinite;
  animation: ${loadingKeyframes} 1s linear infinite;
  top: 100px;
  left: 100px;
  
  &:after {
    ${loadingIndicatorCommonContent}
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
`;

export const LoadingIndicator = () => (
  <LoadingIndicatorWrapper>
    <LoadingIndicatorRolling>
      <LoadingIndicatorContent />
    </LoadingIndicatorRolling>
  </LoadingIndicatorWrapper>
);

export const ContentHeaderTitleStyled = styled.h1`
  display: flex;
  align-items: center;
`;

export const MarginLeftButtonStyled = styled(Button)`
  margin-left: 15px;
`;

export const FunctionWrapperStyled = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const OpacityTextStyled = styled.div`
  opacity: 0.4;
`;