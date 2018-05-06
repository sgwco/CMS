import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';
import styled, { keyframes } from 'styled-components';
import { chooseBlackOrWhiteDependOnHex } from '../utils/utils';

export const FunctionItem = styled.span`
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
`;

export const FunctionCell = ({ url, onDelete }) => (
  <FunctionWrapperStyled>
    <FunctionItem>
      <Link to={url}>
        <Button color="warning">
          <FontAwesome icon='edit' className="text-white" />
        </Button>
      </Link>
    </FunctionItem>
    <FunctionItem>
      <Button color="danger" onClick={onDelete}>
        <FontAwesome icon='trash' className="text-white" />
      </Button>
    </FunctionItem>
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
  justify-content: center;
`;

export const OpacityTextStyled = styled.div`
  opacity: 0.4;
`;

const CardViewWrapperStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-left: 4px solid ${props => props.color};
  box-shadow: 0px 5px 5px rgba(0,0,0,0.4);
  border-radius: 2px;
  margin-bottom: 20px;
`;

const CardViewIconStyled = styled(FontAwesome)`
  color: ${props => props.color};
  font-size: 2rem;
  margin-left: 20px;
  display: block;
  width: 40px !important;
`;

const CardViewTextStyled = styled.div`
  padding: 10px 20px;
  width: 100%;
`;

const CardViewTextLabel = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.8rem;
`;

const CardViewButtonStyled = styled.button`
  margin-left: auto;
  background-color: ${props => props.color};
  align-self: stretch;
  width: 80px;
  border: none;
  font-size: 2rem;
  color: ${props => chooseBlackOrWhiteDependOnHex(props.color)};
`;

export const CardViewListStyled = ({ color, icon, label, buttonIcon, buttonFunc, children }) => (
  <CardViewWrapperStyled color={color}>
    <CardViewIconStyled icon={icon} color={color} />
    <CardViewTextStyled>
      <CardViewTextLabel>{label}</CardViewTextLabel>
      {children}
    </CardViewTextStyled>
    {buttonFunc && (
      <CardViewButtonStyled onClick={buttonFunc} color={color}>
        <FontAwesome icon={buttonIcon} />
      </CardViewButtonStyled>
    )}
  </CardViewWrapperStyled>
);