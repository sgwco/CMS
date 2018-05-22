import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Link, withRouter } from 'react-router-dom';
import { compose, withHandlers, withProps } from 'recompose';
import { Alert, Badge, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import moment from 'moment';
import _ from 'lodash';
import { TableHeaderColumn } from 'react-bootstrap-table';

import Breadcrumb from '../../../shared/breadcrumb';
import lang from '../../../languages';
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
  onWithdraw,
  language
}) => (
  <Modal isOpen={detailModalVisible} toggle={() => toggleDetailModal()} size="lg">
    <ModalHeader toggle={() => toggleDetailModal()}>{lang('package_detail', language)}</ModalHeader>
    <ModalBody>
      <CardViewListStyled color='#e74c3c' icon='user' label={lang('user', language)}>
        {selectedPackage.user.username + (selectedPackage.user.fullname && ` (${selectedPackage.user.fullname})`)}
      </CardViewListStyled>
      <CardViewListStyled color='#00b894' icon='money-bill-alt' label={lang('package_price', language)}>
        {`${(selectedPackage.price * 1000).toLocaleString('vi')} ${selectedPackage.currency}`}
      </CardViewListStyled>
      <CardViewListStyled color='#fd79a8' icon='clock' label={lang('register_date', language)}>
        {moment(selectedPackage.registerDate).format('DD/MM/YYYY')}
      </CardViewListStyled>
      <CardViewListStyled
        color='#a29bfe'
        icon='briefcase'
        label={lang('package_type', language)}
        buttonIcon={
          (selectedPackage.duration === getKeyAsString(DURATION_TYPE.MONTH_6, DURATION_TYPE) &&
          selectedPackage.status === getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS) &&
          moment().diff(moment(selectedPackage.registerDate), 'months') >= 4 &&
          moment().diff(moment(selectedPackage.registerDate), 'months') <= 5) ? 'arrow-circle-up' : null
        }
        buttonFunc={() => onUpgradePackage(selectedPackage.id)}
      >
        {`${DURATION_TYPE[selectedPackage.duration]} ${lang('months', language)}`}
      </CardViewListStyled>
      <CardViewListStyled
        color='#00cec9'
        icon='angle-double-right'
        label={lang('status', language)}
        buttonIcon={(packageStatusCardButton[selectedPackage.status] || {}).icon}
        buttonFunc={() => (packageStatusCardButton[selectedPackage.status] || {}).func(selectedPackage.id)}
      >
        {_.startCase(lang(_.toLower(selectedPackage.status), language))}
      </CardViewListStyled>
      {selectedPackage.status !== getKeyAsString(PACKAGE_STATUS.PENDING, PACKAGE_STATUS) && (
        <CardViewListStyled color='#00b894' icon='spinner' label={lang('progress', language)}>
          <ProgressDot selectedPackage={selectedPackage} onWithdraw={onWithdraw} language={language} />
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
  packageStatusFormatter,
  language
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>{lang('packages', language)}</span>
        <Link to={`${match.url}/add-new`}>
          <MarginLeftButtonStyled color="primary" size="sm">
            <FontAwesome icon="plus" /> {`${lang('add_new', language)} ${lang('package', language).toLowerCase()}`}
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
              {lang('username', language)}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='fullname'
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
              dataFormat={nothingFormatted}
            >
              {lang('fullname', language)}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='price'
              dataSort
              filter={{ type: 'TextFilter', delay: 1 }}
              dataFormat={(cell, row) => `${cell.toLocaleString('vi')}.000 ${row.currency}`}
            >
              {lang('package_price', language)}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='duration'
              dataSort
              dataFormat={cell => DURATION_TYPE[cell] + ` ${lang('months', language)}`}
              filter={{ type: 'SelectFilter', options: concatObjectEnum(DURATION_TYPE, ` ${lang('months', language)}`) }}
            >
              {lang('package_type', language)}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='registerDate'
              dataFormat={cell => moment(cell).format('DD/MM/YYYY')}
              filter={{ type: 'TextFilter', delay: 1 }}
            >
              {lang('register_date', language)}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField='status'
              filter={{ type: 'SelectFilter', options: uppercaseObjectValue(PACKAGE_STATUS) }}
              dataFormat={packageStatusFormatter}
            >
              {lang('status', language)}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataFormat={functionFormatter}
              width='200'
            />
          </BootstrapTableStyled>
          {selectedPackageIndex > -1 && (
            <AdminPackageModal
              language={language}
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
    packageStatusFormatter: ({ language }) => cell => {
      const cellFormatted = _.startCase(lang(_.toLower(cell), language));
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