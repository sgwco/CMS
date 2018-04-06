import React from 'react';

export const BoxBody = ({ children }) => (
  <div className="box-body">{children}</div>
);

export const BoxFooter = ({ children }) => (
  <div className="box-footer">{children}</div>
);

export const BoxWrapper = ({ color, title, children }) => (
  <div className={`box box-${color}`}>
    <div className="box-header">
      <div className="box-title">{title}</div>
    </div>
    {children}
  </div>
);