import React from 'react';
import { ContentHeaderTitleStyled } from '../../../shared/components';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import Breadcrumb from '../../../shared/breadcrumb';

import DashboardMember from './admin-content-dashboard/dashboard-member';

const AdminContentDashboardComponent = ({
  breadcrumbItems
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Dashboard</span>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <DashboardMember />
    </ContentBody>
  </ContentContainer>
);

export default AdminContentDashboardComponent;