import React from 'react';
import { Row, Col, Button } from 'reactstrap';

import { ListCardboard } from './cardboard';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../../shared/boxWrapper';
import ProgressDot from '../../../../shared/progress-dot';
import { getKeyAsString } from '../../../../utils/utils';
import { PACKAGE_STATUS } from '../../../../utils/enum';

const DashboardMember = ({
  activePackage: { activePackage = {} },
  onUpgradePackage
}) => (
  Object.keys(activePackage).length > 0 && (
    <Row>
      <Col lg={6}>
        <ListCardboard activePackage={activePackage} />
      </Col>
      <Col lg={6}>
        <BoxWrapper color="primary" title="Progress">
          <BoxBody>
            <ProgressDot selectedPackage={activePackage} />
          </BoxBody>
          <BoxFooter>
            <Button
              color="danger"
              type="button"
              className="float-right"
              onClick={() => onUpgradePackage(activePackage.id)}
              disabled={activePackage.status !== getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS)}
            >
              Withdraw Package
            </Button>
          </BoxFooter>
        </BoxWrapper>
      </Col>
    </Row>
  )
);

export default DashboardMember;