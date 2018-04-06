import React from 'react';

export const ContentContainer = ({ children }) => (
  <div className="content-wrapper">{children}</div>
);

export const ContentHeader = ({ children }) => (
  <section className="content-header">{children}</section>
);

export const ContentBody = ({ children }) => (
  <section className="content">{children}</section>
);