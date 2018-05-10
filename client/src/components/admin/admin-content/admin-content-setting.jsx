import React from 'react';

import { ContentHeaderTitleStyled } from '../../../shared/components';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/components';
import Breadcrumb from '../../../shared/breadcrumb';
import { BoxWrapper, BoxBody } from '../../../shared/boxWrapper';

const AdminContentDashboardComponent = ({
  breadcrumbItems,
}) => (
  <ContentContainer>
    <ContentHeader>
      <ContentHeaderTitleStyled>
        <span>Setting</span>
      </ContentHeaderTitleStyled>
      <Breadcrumb items={breadcrumbItems} />
    </ContentHeader>
    <ContentBody>
      <BoxWrapper color="primary" title="Setting">
        <BoxBody />
      </BoxWrapper>
    </ContentBody>
  </ContentContainer>
);

export default AdminContentDashboardComponent;