import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import moment from 'moment';

import { BoxWrapper, BoxBody, BoxFooter } from '../../../../shared/boxWrapper';
import ProgressDot from '../../../../shared/progress-dot';
import { CardboardItem } from '../../../../shared/components';
import { getKeyAsString } from '../../../../utils/utils';
import { PACKAGE_STATUS, DURATION_TYPE } from '../../../../utils/enum';

const DashboardMember = ({
  listActivePackages,
  listPackages: { activePackage = [] },
  onWithdrawPackage,
  language
}) => (
  Object.keys(activePackage).length > 0 && (
    <div>
      <Row>
        <Col md={4}>
          <CardboardItem
            color='yellow'
            title={<FormattedMessage id="categories.packages" />}
            content={activePackage.length}
            icon='briefcase'
          />
        </Col>
        <Col md={4}>
          <CardboardItem
            color='aqua'
            title={<FormattedMessage id="active_package" />}
            content={activePackage.filter(item => item.status === 'ACTIVE').length}
            icon='briefcase'
          />
        </Col>
        <Col md={4}>
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
                <Row>
                  <Col lg={6}>
                    <div>
                      <FormattedMessage tagName='strong' id="progress_dot.package_value" />{': '}<br/>
                      <FormattedNumber value={packageItem.price * 1000} /> VND
                    </div>
                    <div>
                      <FormattedMessage tagName='strong' id="progress_dot.package_type" />{': '}
                      {DURATION_TYPE[packageItem.duration]} <FormattedMessage id='month.months' />
                    </div>
                  </Col>
                  {packageItem.transferMoney && packageItem.transferMoney.length > 0 && (
                    <Col lg={6}>
                      <div>
                        <FormattedMessage tagName='strong' id="progress_dot.effective_date" />{': '}
                        {moment(packageItem.transferMoney[0].date).format('DD/MM/YYYY')}
                      </div>
                      <div>
                        <FormattedMessage tagName='strong' id="progress_dot.expiration_date" />{': '}
                        {moment(packageItem.transferMoney[packageItem.transferMoney.length - 1].date).format('DD/MM/YYYY')}
                      </div>
                    </Col>
                  )}
                </Row>
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
                    <FormattedMessage id="stop_package" />
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