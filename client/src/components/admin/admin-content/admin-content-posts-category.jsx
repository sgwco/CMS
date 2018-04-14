import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose, withHandlers, withProps } from 'recompose';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { FunctionCell, ContentHeaderTitleStyled, MarginLeftButtonStyled, FunctionWrapperStyled, LoadingIndicator } from '../../../shared/components';
import { BoxWrapper, BoxBody } from '../../../shared/boxWrapper';
import { Breadcrumb, Alert } from 'reactstrap';
import { ALERT_STATUS } from '../../../commons/enum';
import FontAwesome from '@fortawesome/react-fontawesome';
// import SortableTree from 'react-sortable-tree';
// import 'react-sortable-tree/style.css';

const AdminContentPostsCategoryComponent = ({ 
  match, 
  breadcrumbItems,
  tableHeaders,
  alertVisible,
  removeAlert,
  alertContent,
  getCategories: { categories = [] }
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Category</span>
        <Link to={`${match.url}/add-new`}>
          <MarginLeftButtonStyled color="primary" size="sm">
            <FontAwesome icon="plus" /> Add new category
          </MarginLeftButtonStyled>
        </Link>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
        {alertContent}
      </Alert>
      <BoxWrapper color="primary" title="List Category">
        <BoxBody>
          <BootstrapTable
            keyField='name'
            data={categories}
            columns={tableHeaders}
            filter={filterFactory()}
            noDataIndication="Table is Empty"
            striped
            hover
          />
        </BoxBody>
      </BoxWrapper>
    </ContentBody>
  </ContentContainer>
);

export default compose(
  withRouter,
  withHandlers({
    functionFormatter: ({ onRemoveCategory, match }) => (cell, row) => {
      let functionCell = null;
      functionCell = (
        <FunctionWrapperStyled>
          <LoadingIndicator />
        </FunctionWrapperStyled>
      );
      if (typeof row.id === 'number' && row.id < 0) {
        functionCell = (
          <FunctionWrapperStyled>
            <LoadingIndicator />
          </FunctionWrapperStyled>
        );
      }
      else {
        functionCell = <FunctionCell url={`${match.url}/edit/${row.id}`} onDelete={() => onRemoveCategory(row.id)} />;
      }
      
      return functionCell;
    }
  }),
  withProps(({ functionFormatter }) => ({
    tableHeaders: [
      { text: 'Name', dataField: 'name', filter: textFilter({ delay: 0 }) },
      { text: 'Function', dataField: '', headerClasses: 'function-column', formatter: functionFormatter }
    ]
  }))
)(AdminContentPostsCategoryComponent);