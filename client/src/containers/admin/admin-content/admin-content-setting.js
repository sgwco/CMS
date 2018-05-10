import { compose, withProps } from 'recompose';

import AdminContentSettingComponent from '../../../components/admin/admin-content/admin-content-setting';

export default compose(
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Setting' }
    ]
  })),
)(AdminContentSettingComponent);