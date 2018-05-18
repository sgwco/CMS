import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Link, withRouter } from 'react-router-dom';
import { compose, withHandlers, withProps } from 'recompose';
import { Alert, Badge, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import moment from 'moment';
import _ from 'lodash';
import { TableHeaderColumn } from 'react-bootstrap-table';

import Breadcrumb from '../../../shared/breadcrumb';
import {
  LoadingIndicator,
  ContentHeaderTitleStyled,
  MarginLeftButtonStyled,
  FunctionWrapperStyled,
  FunctionItem,
  CardViewListStyled,
  BootstrapTableStyled
} from '../../../shared/components';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
import { BoxWrapper, BoxBody } from '../../../shared/boxWrapper';
import { ALERT_STATUS, DURATION_TYPE, PACKAGE_STATUS } from '../../../utils/enum';
import { uppercaseObjectValue, getKeyAsString, concatObjectEnum } from '../../../utils/utils';
import ProgressDot from '../../../shared/progress-dot';
import { tablePaginationSetting } from '../../../config.json';

const AdminPackageModal = ({
  selectedPackage,
  detailModalVisible,
  toggleDetailModal,
  onUpgradePackage,
  packageStatusCardButton,
  onWithdraw
}) => (
  <Modal isOpen={detailModalVisible} toggle={() => toggleDetailModal()} size="lg">
    <ModalHeader toggle={() => toggleDetailModal()}>Package detail</ModalHeader>
    <ModalBody>
      <CardViewListStyled color='#e74c3c' icon='user' label='User'>
        {selectedPackage.user.username + (selectedPackage.user.fullname && ` (${selectedPackage.user.fullname})`)}
      </CardViewListStyled>
      <CardViewListStyled color='#00b894' icon='money-bill-alt' label='Package Price'>
        {`${(selectedPackage.price * 1000).toLocaleString('vi')} ${selectedPackage.currency}`}
      </CardViewListStyled>
      <CardViewListStyled color='#fd79a8' icon='clock' label='Registered Date'>
        {moment(selectedPackage.registerDate).format('DD/MM/YYYY')}
      </CardViewListStyled>
      <CardViewListStyled
        color='#a29bfe'
        icon='briefcase'
        label='Package Type'
        buttonIcon={
          (selectedPackage.duration === getKeyAsString(DURATION_TYPE.MONTH_6, DURATION_TYPE) &&
          selectedPackage.status === getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS) &&
          moment().diff(moment(selectedPackage.registerDate), 'months') >= 4 &&
          moment().diff(moment(selectedPackage.registerDate), 'months') <= 5) ? 'arrow-circle-up' : null
        }
        buttonFunc={() => onUpgradePackage(selectedPackage.id)}
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
);

const AdminContentPackageComponent = ({
  match,
  breadcrumbItems = [],
  alertContent,
  alertVisible,
  removeAlert,
  nothingFormatted,
  getPackages: { packages = [] },
  packagesNormalizer,
  selectedPackageIndex,
  toggleDetailModal,
  onUpgradePackage,
  onWithdraw,
  packageStatusCardButton,
  functionFormatter,
  packageStatusFormatter
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
          {/* <BootstrapTable
            keyField='id'
            data={packages}
            columns={tableHeaders}
            filter={filterFactory()}
            noDataIndication="Table is Empty"
            striped
            hover
          /> */}
          <BootstrapTableStyled
            data={packagesNormalizer()}
            options={tablePaginationSetting}
            pagination
            striped
            hover
          >
            <TableHeaderColumn
              dataField='username'
              isKey
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
            >
              Username
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='fullname'
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
              dataFormat={nothingFormatted}
            >
              Fullname
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='price'
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
              dataFormat={(cell, row) => `${cell.toLocaleString('vi')}.000 ${row.currency}`}
            >
              Package Price
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='duration'
              dataSort
              dataFormat={cell => DURATION_TYPE[cell] + ' Months'}
              filter={{ type: 'SelectFilter', options: concatObjectEnum(DURATION_TYPE, ' Months') }}
            >
              Package Type
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='registerDate'
              dataFormat={cell => moment(cell).format('DD/MM/YYYY')}
              filter={{ type: 'TextFilter', delay: 1 }}
            >
              Register Date
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='status'
              filter={{ type: 'SelectFilter', options: uppercaseObjectValue(PACKAGE_STATUS) }}
              dataFormat={packageStatusFormatter}
            >
              Status
            </TableHeaderColumn>
            <TableHeaderColumn
              dataFormat={functionFormatter}
              width='200'
            />
          </BootstrapTableStyled>
          {selectedPackageIndex > -1 && (
            <AdminPackageModal
              selectedPackage={packages[selectedPackageIndex]}
              detailModalVisible={selectedPackageIndex > -1}
              toggleDetailModal={toggleDetailModal}
              onUpgradePackage={onUpgradePackage}
              packageStatusCardButton={packageStatusCardButton}
              onWithdraw={onWithdraw}
            />
          )}
        </BoxBody>
      </BoxWrapper>
    </ContentBody>
  </ContentContainer>
);

export default compose(
  withRouter,
  withHandlers({
    functionFormatter: ({ onRemovePackage, toggleDetailModal, getPackages: { packages = [] } }) => (cell, row) => {
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
            <FunctionItem>
              <Button color="info" onClick={() => toggleDetailModal(packages.findIndex(item => item.id === row.id))}>
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
    },
    nothingFormatted: () => cell => cell || '—'
  }),
  withProps(({ onDeactivePackage, onActivePackage }) => ({
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