import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Link, withRouter } from 'react-router-dom';
import { compose, withHandlers, withProps } from 'recompose';
import { Alert, Badge, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import moment from 'moment';
import _ from 'lodash';

import Breadcrumb from '../../../shared/breadcrumb';
import {
  LoadingIndicator,
  ContentHeaderTitleStyled,
  MarginLeftButtonStyled,
  FunctionWrapperStyled,
  FunctionItem
} from '../../../shared/components';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { BoxWrapper, BoxBody } from '../../../shared/boxWrapper';
import { ALERT_STATUS, DURATION_TYPE, CURRENCY, PACKAGE_STATUS } from '../../../utils/enum';
import { uppercaseObjectValue, getKeyAsString } from '../../../utils/utils';

const durationFilter = {
  'MONTH_6': '6 Months',
  'MONTH_12': '12 Months'
};

const AdminContentPackageComponent = ({
  match,
  breadcrumbItems = [],
  alertContent,
  alertVisible,
  removeAlert,
  tableHeaders,
  getPackages: { packages = [] }
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Package</span>
        <Link to={`${match.url}/add-new`}>
          <MarginLeftButtonStyled color="primary" size="sm">
            <FontAwesome icon="plus" /> Add new package
          </MarginLeftButtonStyled>
        </Link>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
        {alertContent}
      </Alert>
      <BoxWrapper color="primary" title="List Packages">
        <BoxBody>
          <BootstrapTable
            keyField='id'
            data={packages}
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
    functionFormatter: ({ onRemovePackage, onUpgradePackage, onDeactivePackage }) => (cell, row) => {
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
        functionCell = (
          <FunctionWrapperStyled>
            {/* <FunctionItem>
              <Link to={`${match.url}/edit/${row.id}`}>
                <Button color="warning">
                  <FontAwesome icon='edit' className="text-white" />
                </Button>
              </Link>
            </FunctionItem> */}
            {row.duration === getKeyAsString(DURATION_TYPE.MONTH_6, DURATION_TYPE) && (
              <FunctionItem>
                <Button color="success" onClick={() => onUpgradePackage(row.id)}>
                  <FontAwesome icon='arrow-circle-up' className="text-white" />
                </Button>
              </FunctionItem>
            )}
            {row.status === getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS) && (
              <FunctionItem>
                <Button color="secondary" onClick={() => onDeactivePackage(row.id)}>
                  <FontAwesome icon='money-bill-alt' className="text-white" />
                </Button>
              </FunctionItem>
            )}
            <FunctionItem>
              <Button color="danger" onClick={() => onRemovePackage(row.id)}>
                <FontAwesome icon='trash' className="text-white" />
              </Button>
            </FunctionItem>
          </FunctionWrapperStyled>
        );
      }
      
      return functionCell;
    },
    packageStatusFormatter: () => cell => {
      const cellFormatted = _.startCase(_.toLower(cell));
      const COLOR_TYPE = {
        ACTIVE: 'success',
        PENDING: 'secondary',
        EXPIRED: 'warning'
      };
      const badge = <h4><Badge color={COLOR_TYPE[cell]}>{cellFormatted}</Badge></h4>;
      return badge;
    }
  }),
  withProps(({ functionFormatter, packageStatusFormatter }) => ({
    tableHeaders: [
      { text: 'Username', dataField: 'user.username', filter: textFilter({ delay: 0 }) },
      { text: 'Fullname', dataField: 'user.fullname', filter: textFilter({ delay: 0 }), formatter: cell => cell || '—' },
      { text: 'Package Price', dataField: 'price', filter: textFilter({ delay: 0 }) },
      { text: 'Currency', dataField: 'currency', filter: selectFilter({ options: CURRENCY }) },
      { text: 'Package Type', dataField: 'duration', filter: selectFilter({ options: durationFilter }), formatter: cell => DURATION_TYPE[cell] + ' Months' },
      { text: 'Register Date', dataField: 'registerDate', filter: textFilter({ delay: 0 }), formatter: cell => moment(cell).format('DD/MM/YYYY') },
      { text: 'Status', dataField: 'status', filter: selectFilter({ options: uppercaseObjectValue(PACKAGE_STATUS) }), formatter: packageStatusFormatter },
      { text: 'Function', dataField: '', formatter: functionFormatter }
    ]
  }))
)(AdminContentPackageComponent);