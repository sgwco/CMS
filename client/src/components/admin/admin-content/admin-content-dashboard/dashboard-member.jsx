import React from 'react';
import { Row, Col, Button } from 'reactstrap';

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
            title='Package(s)'
            content={activePackage.length}
            icon='briefcase'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='green'
            title='Total Price'
            content={`${(activePackage.reduce((total, item) => total + item.price, 0) * 1000).toLocaleString('vi')} VND`}
            icon='money-bill-alt'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='aqua'
            title='Active Package(s)'
            content={activePackage.filter(item => item.status === 'ACTIVE').length}
            icon='briefcase'
          />
        </Col>
        <Col md={3}>
          <CardboardItem
            color='red'
            title='Total Price of Active Package(s)'
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
                    Withdraw Package
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