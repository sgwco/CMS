import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Link, withRouter } from 'react-router-dom';
import { compose, withHandlers, withProps } from 'recompose';
import { Alert, Badge, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import moment from 'moment';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TableHeaderColumn } from 'react-bootstrap-table';

import Breadcrumb from '../../../shared/breadcrumb';
import {
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
  onWithdraw,
  intl
}) => (
  <Modal isOpen={detailModalVisible} toggle={() => toggleDetailModal()} size="lg">
    <ModalHeader toggle={() => toggleDetailModal()}>
      <FormattedMessage id='package_detail' />
    </ModalHeader>
    <ModalBody>
      <CardViewListStyled color='#6ab04c' icon='id-badge' label={intl.messages['fields.package_id']}>
        {selectedPackage.packageId}
      </CardViewListStyled>
      <CardViewListStyled color='#e74c3c' icon='user' label={intl.messages['fields.username']}>
        {selectedPackage.user.username + (selectedPackage.user.fullname && ` (${selectedPackage.user.fullname})`)}
      </CardViewListStyled>
      {selectedPackage.introducer && (
        <CardViewListStyled color='#22a6b3' icon='user' label={intl.messages['fields.introducer']}>
          {selectedPackage.introducer.username + (selectedPackage.introducer.fullname && ` (${selectedPackage.introducer.fullname})`)}
        </CardViewListStyled>
      )}
      <CardViewListStyled color='#00b894' icon='money-bill-alt' label={intl.messages['fields.package_price']}>
        {`${intl.formatNumber(selectedPackage.price * 1000)} ${selectedPackage.currency}`}
      </CardViewListStyled>
      <CardViewListStyled color='#fd79a8' icon='clock' label={intl.messages['fields.register_date']}>
        {moment(selectedPackage.registerDate).format('DD/MM/YYYY')}
      </CardViewListStyled>
      <CardViewListStyled
        color='#a29bfe'
        icon='briefcase'
        label={intl.messages['fields.package_type']}
        buttonIcon={
          (selectedPackage.duration === getKeyAsString(DURATION_TYPE.MONTH_6, DURATION_TYPE) &&
          selectedPackage.status === getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS) &&
          moment().diff(moment(selectedPackage.registerDate), 'months') >= 4 &&
          moment().diff(moment(selectedPackage.registerDate), 'months') <= 5) ? 'arrow-circle-up' : null
        }
        buttonFunc={() => onUpgradePackage(selectedPackage.packageId)}
      >
        {`${DURATION_TYPE[selectedPackage.duration]} ${intl.messages['month.months']}`}
      </CardViewListStyled>
      <CardViewListStyled
        color='#00cec9'
        icon='angle-double-right'
        label={intl.messages['fields.status']}
        buttonIcon={(packageStatusCardButton[selectedPackage.status] || {}).icon}
        buttonFunc={() => (packageStatusCardButton[selectedPackage.status] || {}).func(selectedPackage.packageId)}
      >
        <FormattedMessage id={`package_status.${_.toLower(selectedPackage.status)}`} />
      </CardViewListStyled>
      {selectedPackage.status !== getKeyAsString(PACKAGE_STATUS.PENDING, PACKAGE_STATUS) && (
        <CardViewListStyled color='#00b894' icon='spinner' label={intl.messages['progress']}>
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
  getPackages: { packages = [] },
  packagesNormalizer,
  selectedPackageIndex,
  toggleDetailModal,
  onUpgradePackage,
  onWithdraw,
  packageStatusCardButton,
  functionFormatter,
  packageStatusFormatter,
  intl
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <FormattedMessage id='categories.package' />
        <Link to={`${match.url}/add-new`}>
          <MarginLeftButtonStyled color="primary" size="sm">
            <FontAwesome icon="plus" />{'  '}
            <FormattedMessage id='add_new' />
          </MarginLeftButtonStyled>
        </Link>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
        <FormattedMessage id={alertContent} />
      </Alert>
      <BoxWrapper color="primary" title={intl.messages['list']}>
        <BoxBody>
          <BootstrapTableStyled
            data={packagesNormalizer()}
            options={tablePaginationSetting}
            pagination
            striped
            hover
          >
            <TableHeaderColumn
              dataField='packageId'
              isKey
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
            >
              {intl.messages['fields.package_id']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='username'
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
            >
              {intl.messages['fields.username']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='price'
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
              dataFormat={(cell, row) => `${intl.formatNumber(cell * 1000)} ${row.currency}`}
            >
              {intl.messages['fields.package_price']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='duration'
              dataSort
              dataFormat={cell => DURATION_TYPE[cell] + ` ${intl.messages['month.months']}`}
              filter={{ type: 'SelectFilter', options: concatObjectEnum(DURATION_TYPE, ` ${intl.messages['month.months']}`) }}
            >
              {intl.messages['fields.package_type']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='registerDate'
              dataFormat={cell => moment(cell).format('DD/MM/YYYY')}
              filter={{ type: 'TextFilter', delay: 1 }}
            >
              {intl.messages['fields.register_date']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='status'
              filter={{ type: 'SelectFilter', options: uppercaseObjectValue(PACKAGE_STATUS) }}
              dataFormat={packageStatusFormatter}
            >
              {intl.messages['fields.status']}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataFormat={functionFormatter}
              width='200'
            />
          </BootstrapTableStyled>
          {selectedPackageIndex > -1 && (
            <AdminPackageModal
              intl={intl}
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
  injectIntl,
  withHandlers({
    functionFormatter: ({ onRemovePackage, toggleDetailModal, getPackages: { packages = [] } }) => (cell, row) => {
      const functionCell = (
        <FunctionWrapperStyled>
          <FunctionItem>
            <Button color="info" onClick={() => toggleDetailModal(packages.findIndex(item => item.packageId === row.packageId))}>
              <FontAwesome icon='eye' />
            </Button>
          </FunctionItem>
          <FunctionItem>
            <Button color="danger" onClick={() => onRemovePackage(row.packageId)}>
              <FontAwesome icon='trash' className="text-white" />
            </Button>
          </FunctionItem>
        </FunctionWrapperStyled>
      );
      
      return functionCell;
    },
    packageStatusFormatter: () => cell => {
      const cellFormatted = <FormattedMessage id={`package_status.${_.toLower(cell)}`} />;

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
        func: packageId => onDeactivePackage(packageId)
      },
      PENDING: {
        icon: 'check',
        func: packageId => onActivePackage(packageId)
      },
      PENDING_EXPIRED: {
        icon: 'ban',
        func: packageId => onDeactivePackage(packageId)
      }
    }
  }))
)(AdminContentPackageComponent);