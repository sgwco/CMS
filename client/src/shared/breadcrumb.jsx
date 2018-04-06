import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import FontAwesome from '@fortawesome/react-fontawesome';

const BreadcrumbWithIcon = ({ url, icon, text }) => (
  <BreadcrumbItem>
    <Link to={url}><FontAwesome icon={icon} /> {text}</Link>
  </BreadcrumbItem>
);

const BreadcrumbWithoutIcon = ({ text }) => (
  <BreadcrumbItem active>{text}</BreadcrumbItem>
);

const BreadcrumbComponent = ({ items }) => (
  <Breadcrumb>
    {items.map((item, index) =>
      items.length === index + 1 ?
        <BreadcrumbWithoutIcon key={index} {...item} /> :
        <BreadcrumbWithIcon key={index} {...item} />
    )}
  </Breadcrumb>
);

export default BreadcrumbComponent;