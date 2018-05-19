import React from 'react';
import { Row, Col, Button, Input } from 'reactstrap';
import { Pie } from 'react-chartjs-2';

import { BoxWrapper, BoxBody, BoxFooter } from '../../../../shared/boxWrapper';
import ProgressDot from '../../../../shared/progress-dot';
import { CardboardItem } from '../../../../shared/components';
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
        <Col lg={6}>
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