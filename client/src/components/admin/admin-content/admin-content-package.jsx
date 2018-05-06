import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Link, withRouter } from 'react-router-dom';
import { compose, withHandlers, withProps } from 'recompose';
import { Alert, Badge, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
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
  FunctionItem,
  CardViewListStyled
} from '../../../shared/components';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { BoxWrapper, BoxBody } from '../../../shared/boxWrapper';
import { ALERT_STATUS, DURATION_TYPE, CURRENCY, PACKAGE_STATUS } from '../../../utils/enum';
import { uppercaseObjectValue, getKeyAsString, concatObjectEnum } from '../../../utils/utils';
import ProgressDot from '../../../shared/progress-dot';

const AdminContentPackageComponent = ({
  match,
  breadcrumbItems = [],
  alertContent,
  alertVisible,
  removeAlert,
  tableHeaders,
  getPackages: { packages = [] },
  detailModalVisible,
  selectedPackage,
  toggleDetailModal,
  onUpgradePackage,
  onWithdraw,
  packageStatusCardButton
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
          {detailModalVisible && (
            <Modal isOpen={detailModalVisible} toggle={() => toggleDetailModal()} size="lg">
              <ModalHeader toggle={() => toggleDetailModal()}>Package detail</ModalHeader>
              <ModalBody>
                <CardViewListStyled color='#e74c3c' icon='user' label='User'>
                  {selectedPackage.user.username + (selectedPackage.user.fullname && ` (${selectedPackage.user.fullname})`)}
                </CardViewListStyled>
                <CardViewListStyled color='#00b894' icon='money-bill-alt' label='Package Price'>
                  {`${selectedPackage.price} ${selectedPackage.currency}`}
                </CardViewListStyled>
                <CardViewListStyled color='#fd79a8' icon='clock' label='Registered Date'>
                  {moment(selectedPackage.registerDate).format('DD/MM/YYYY')}
                </CardViewListStyled>
                <CardViewListStyled
                  color='#a29bfe'
                  icon='briefcase'
                  label='Package Type'
                  buttonIcon='arrow-circle-up'
                  buttonFunc={
                    (selectedPackage.duration === getKeyAsString(DURATION_TYPE.MONTH_6, DURATION_TYPE) &&
                    selectedPackage.status === getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS) &&
                    moment().diff(moment(selectedPackage.registerDate), 'months') >= 4 &&
                    moment().diff(moment(selectedPackage.registerDate), 'months') <= 5) ? () => onUpgradePackage(selectedPackage.id) : null
                  }
                >
                  {`${DURATION_TYPE[selectedPackage.duration]} Months`}
                </CardViewListStyled>
                <CardViewListStyled
                  color='#00cec9'
                  icon='angle-double-right'
                  label='Status'
                  buttonIcon={(packageStatusCardButton[selectedPackage.status] || {}).icon}
                  buttonFunc={() => (packageStatusCardButton[selectedPackage.status] || {}).func(selectedPackage.id)}
                >
                  {_.startCase(_.toLower(selectedPackage.status))}
                </CardViewListStyled>
                {selectedPackage.status !== getKeyAsString(PACKAGE_STATUS.PENDING, PACKAGE_STATUS) && (
                  <CardViewListStyled color='#00b894' icon='spinner' label='Progress'>
                    <ProgressDot selectedPackage={selectedPackage} onWithdraw={onWithdraw} />
                  </CardViewListStyled>
                )}
              </ModalBody>
            </Modal>
          )}
        </BoxBody>
      </BoxWrapper>
    </ContentBody>
  </ContentContainer>
);

export default compose(
  withRouter,
  withHandlers({
    functionFormatter: ({ onRemovePackage, toggleDetailModal }) => (cell, row) => {
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
            <FunctionItem>
              <Button color="info" onClick={() => toggleDetailModal(row)}>
                <FontAwesome icon='eye' />
              </Button>
            </FunctionItem>
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
        PENDING: 'warning',
        PENDING_EXPIRED: 'danger',
        EXPIRED: 'secondary'
      };
      const badge = <h4><Badge color={COLOR_TYPE[cell]}>{cellFormatted}</Badge></h4>;
      return badge;
    }
  }),
  withProps(({ functionFormatter, packageStatusFormatter, onDeactivePackage, onActivePackage }) => ({
    tableHeaders: [
      { text: 'Username', dataField: 'user.username', filter: textFilter({ delay: 0 }), sort: true },
      { text: 'Fullname', dataField: 'user.fullname', filter: textFilter({ delay: 0 }), formatter: cell => cell || '—', sort: true },
      { text: 'Package Price', dataField: 'price', filter: textFilter({ delay: 0 }), sort: true },
      { text: 'Currency', dataField: 'currency', filter: selectFilter({ options: CURRENCY }) },
      { text: 'Package Type', dataField: 'duration', filter: selectFilter({ options: concatObjectEnum(DURATION_TYPE, ' Months') }), formatter: cell => DURATION_TYPE[cell] + ' Months' },
      { text: 'Register Date', dataField: 'registerDate', filter: textFilter({ delay: 0 }), formatter: cell => moment(cell).format('DD/MM/YYYY'), sort: true },
      { text: 'Status', dataField: 'status', filter: selectFilter({ options: uppercaseObjectValue(PACKAGE_STATUS) }), formatter: packageStatusFormatter },
      { text: 'Function', dataField: '', formatter: functionFormatter }
    ],
    packageStatusCardButton: {
      ACTIVE: {
        icon: 'ban',
        func: id => onDeactivePackage(id)
      },
      PENDING: {
        icon: 'check',
        func: id => onActivePackage(id)
      },
      PENDING_EXPIRED: {
        icon: 'ban',
        func: id => onDeactivePackage(id)
      }
    }
  }))
)(AdminContentPackageComponent);