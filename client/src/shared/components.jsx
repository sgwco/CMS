import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';

export const FunctionCell = ({ url, onDelete }) => (
  <div className="function-btn">
    <Link to={url}>
      <Button color="warning">
        <FontAwesome icon='edit' className="text-white" />
      </Button>
    </Link>
    <Button color="danger" onClick={onDelete}>
      <FontAwesome icon='trash' className="text-white" />
    </Button>
  </div>
);