import React from 'react';
import { compose, withHandlers } from 'recompose';

import { ContentHeaderTitleStyled } from '../../../shared/components';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import Breadcrumb from '../../../shared/breadcrumb';

import DashboardMember from '../../../containers/admin/admin-content/admin-content-dashboard/dashboard-member';
import { roleCapabilities } from '../../../utils/enum';

const AdminContentDashboardComponent = ({
  breadcrumbItems,
  getUserToken: { loggedInUser = {} },
  checkRoleAllowed
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Dashboard</span>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      {loggedInUser && checkRoleAllowed((loggedInUser.role || {}).accessPermission, roleCapabilities.write_packages.value) === 0 && (
        <DashboardMember />
      )}
    </ContentBody>
  </ContentContainer>
);

export default compose(
  withHandlers({
    checkRoleAllowed: () => (accessPermission, permission) => {
      if (!permission) return 1;
      return accessPermission & permission;
    }
  })
)(AdminContentDashboardComponent);