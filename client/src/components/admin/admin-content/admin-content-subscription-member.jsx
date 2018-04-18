import React from 'react';
import { ContentContainer, ContentBody } from '../../../shared/contentContainer';
import { Row, Col } from 'reactstrap';
import FontAwesome from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const PackageStyled = styled.div`
  background: #49B2EE;
  padding:15px 0px;
  font-family: 'Open Sans Condensed', sans-serif;
  font-weight:300;
  text-align: center;
  margin-bottom: 20px;
`;
const H3Styled = styled.h3`
  font-size: 35px;
  line-height: 45px;
  font-family: 'Open Sans Condensed', sans-serif;
`;
const BStyled = styled.b`
  font-weight:600;
`;
const PStyled = styled.p`
  padding:20px 0px;
  text-align: center;
  background:#fff;
  margin-bottom:0px;
`;
const SpanStyled = styled.span`
  font-weight:600;
  font-size: 25px;
`;
const BottomStyled = styled.div`
  padding:15px 10px;
  text-align:left;
  color: #676767;
  font-size: 16px;
`;
const PBottomStyled = styled.p`
  padding:10px 0px;
  text-align:center;
  margin-bottom:0px;
  font-size: 35px;
  line-height: 45px;
`;
const PPBottomStyled = styled.p`
  font-size: 22px;
  text-align:center
`;
const SpanBottomStyled = styled.span`
  font-size: 16px;
`;
const DivBox = styled.div`
  min-height:150px;
`;
const DivIcon = styled.div`
  top:10px!important;
`;

const AdminContentSubscriptionMemberContainer = () => (
  <ContentContainer>
    <ContentBody>
      <Row>
        <Col md={3}>
          <PackageStyled>
            <H3Styled><BStyled>Ủy thác</BStyled> <br/> cá nhân</H3Styled>
            <PStyled>
              Lãi suất tối thiểu <SpanStyled>100%</SpanStyled> <br />
              trong <SpanStyled>365 ngày</SpanStyled>
            </PStyled>
            <BottomStyled>
              MỨC ĐẦU TƯ:
              <PBottomStyled>$5.000</PBottomStyled>
              <PPBottomStyled>
                THỜI GIAN NHẬN LÃI: QUÝ<br/>
                <SpanBottomStyled>
                  <BStyled>BẢO HIỂM VỐN ĐẾN 100%</BStyled><br/>
                  QUYỀN LỢI CỔ ĐÔNG QUỸ
                </SpanBottomStyled>
              </PPBottomStyled>
            </BottomStyled>
          </PackageStyled>
        </Col>
        <Col md={9}>
          <Row>
            <Col md={6}>
              <DivBox className="small-box bg-aqua">
                <div className="inner">
                  <h4>Tên gói</h4>
                  <p>Ủy thác cá nhân</p>
                </div>
                <DivIcon className="icon">
                  <FontAwesome icon="shopping-bag" />
                </DivIcon>
              </DivBox>
            </Col>
            <Col md={6}>
              <DivBox className="small-box bg-green">
                <div className="inner">
                  <h4>Thời gian bắt đầu:</h4>
                  <p>Ngày: </p>
                </div>
                <DivIcon className="icon">
                  <FontAwesome icon="calendar-alt" />
                </DivIcon>
              </DivBox>
            </Col>
            <Col md={6}>
              <DivBox className="small-box bg-yellow">
                <div className="inner">
                  <h4>Lợi nhuận ngày: </h4>
                  <p>Tiền: </p>
                </div>
                <DivIcon className="icon">
                  <FontAwesome icon="chart-line" />
                </DivIcon>
              </DivBox>
            </Col>
            <Col md={6}>
              <DivBox className="small-box bg-purple">
                <div className="inner">
                  <h4>Thời gian nhận lãi: </h4>
                  <p>Theo: </p>
                </div>
                <DivIcon className="icon">
                  <FontAwesome icon="chart-pie" />
                </DivIcon>
              </DivBox>
            </Col>
          </Row>
        </Col>
      </Row>
    </ContentBody>
  </ContentContainer>
);

export default AdminContentSubscriptionMemberContainer;