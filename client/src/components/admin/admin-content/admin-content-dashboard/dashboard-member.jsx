import React from 'react';
import { Row, Col, Button, Input } from 'reactstrap';
import { Pie } from 'react-chartjs-2';

import { ListCardboard } from './cardboard';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../../shared/boxWrapper';
import ProgressDot from '../../../../shared/progress-dot';
import { getKeyAsString } from '../../../../utils/utils';
import { PACKAGE_STATUS, DURATION_TYPE } from '../../../../utils/enum';

const DashboardMember = ({
  listActivePackages,
  listPackages: { activePackage = [] },
  onUpgradePackage,
  selectPackageAction,
  selectedPackageIndex,
  pieChartData
}) => (
  Object.keys(activePackage).length > 0 && (
    <div>
      <ListCardboard activePackage={activePackage} />
      <Row>
        <Col lg={6}>
          {console.log(pieChartData)}
          <BoxWrapper color="success" title="Packages">
            <BoxBody>
              <Pie data={pieChartData} />
            </BoxBody>
          </BoxWrapper>
        </Col>
        <Col lg={6}>
          <BoxWrapper color="primary" title="Progress">
            <BoxBody>
              <Input type="select" onChange={selectPackageAction}>
                <option value=''>-- Please Select --</option>
                {listActivePackages.map(
                  item => <option key={item.id} value={item.id}>
                    {item.price.toLocaleString('vi')}.000 VND - {DURATION_TYPE[item.duration]} Months
                  </option>
                )}
              </Input>
              <ProgressDot selectedPackage={selectedPackageIndex > -1 ? listActivePackages[selectedPackageIndex] : {}} />
            </BoxBody>
            {selectedPackageIndex > -1 && (
              <BoxFooter>
                <Button
                  color="danger"
                  type="button"
                  className="float-right"
                  onClick={() => onUpgradePackage((selectedPackageIndex > -1 ? listActivePackages[selectedPackageIndex] : {}).id)}
                  disabled={(selectedPackageIndex > -1 ? listActivePackages[selectedPackageIndex] : {}).status !== getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS)}
                >
                  Withdraw Package
                </Button>
              </BoxFooter>
            )}
          </BoxWrapper>
        </Col>
      </Row>
    </div>
  )
);

export default DashboardMember;