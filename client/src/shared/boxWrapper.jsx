import React from 'react';
import styled from 'styled-components';

import { LoadingIndicator } from './components';

export const BoxBody = ({ children }) => (
  <div className="box-body">{children}</div>
);

export const BoxFooter = ({ children }) => (
  <div className="box-footer">{children}</div>
);

const LoadingIndicatorStyled = styled.div`
  position: absolute;
  top: 50% !important;
  left: 50% !important;
  margin-left: -25px;
  margin-top: -25px;
`;

export const BoxWrapper = ({ color, title, children, isLoading }) => (
  <div className={`box box-${color}`}>
    <div className="box-header">
      <div className="box-title">{title}</div>
    </div>
    {children}
    {isLoading && (
      <div className="overlay">
        <LoadingIndicatorStyled>
          <LoadingIndicator />
        </LoadingIndicatorStyled>
      </div>
    )}
  </div>
);