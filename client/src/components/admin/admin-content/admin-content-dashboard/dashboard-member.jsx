import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import { BoxWrapper, BoxBody, BoxFooter } from '../../../../shared/boxWrapper';
import ProgressDot from '../../../../shared/progress-dot';
import { CardboardItem } from '../../../../shared/components';
import { getKeyAsString } from '../../../../utils/utils';
import { PACKAGE_STATUS } from '../../../../utils/enum';

const DashboardMember = ({
  listActivePackages,
  listPackages: { activePackage = [] },
  onWithdrawPackage,
  language
}) => (
  Object.keys(activePackage).length > 0 && (
    <div>
      <Row>
        <Col md={3}>
          <CardboardItem
            color='yellow'
            title={<FormattedMessage id="categories.packages" />}
            content={activePackage.length}
            icon='briefcase'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='green'
            title={<FormattedMessage id="dashboard_page.total_price" />}
            content={`${(activePackage.reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND`}
            icon='money-bill-alt'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='aqua'
            title={<FormattedMessage id="active_package" />}
            content={activePackage.filter(item => item.status === 'ACTIVE').length}
            icon='briefcase'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='red'
            title={<FormattedMessage id="dashboard_page.total_active_price" />}
            content={`${(activePackage.filter(item => item.status === 'ACTIVE').reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND`}
            icon='money-bill-alt'
          />
        </Col>
      </Row>
      <Row>
        {listActivePackages.map(packageItem => (
          <Col lg={6} key={packageItem.packageId}>
            <BoxWrapper color="primary" title={packageItem.packageId}>
              <BoxBody>
                <ProgressDot selectedPackage={packageItem} language={language} />
              </BoxBody>
              {packageItem.status === getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS) && (
                <BoxFooter>
                  <Button
                    color="danger"
                    type="button"
                    className="float-right"
                    onClick={() => onWithdrawPackage(packageItem.packageId)}
                    disabled={packageItem.status !== getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS)}
                  >
                    <FormattedMessage id="withdraw" />
                  </Button>
                </BoxFooter>
              )}
            </BoxWrapper>
          </Col>
        ))}
      </Row>
    </div>
  )
);

export default DashboardMember;