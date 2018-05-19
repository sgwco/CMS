import React from 'react';

import { ContentHeaderTitleStyled } from '../../../shared/components';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
import Breadcrumb from '../../../shared/breadcrumb';

import DashboardAdmin from '../../../containers/admin/admin-content/admin-content-dashboard/dashboard-admin';
import DashboardMember from '../../../containers/admin/admin-content/admin-content-dashboard/dashboard-member';

const AdminContentDashboardComponent = ({
  breadcrumbItems,
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Dashboard</span>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <DashboardAdmin />
      <DashboardMember />
    </ContentBody>
  </ContentContainer>
);

export default AdminContentDashboardComponent;