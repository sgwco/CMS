import { compose, withProps, withHandlers, branch, renderNothing } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentSettingComponent from '../../../components/admin/admin-content/admin-content-setting';
import { GET_SETTINGS } from '../../../utils/graphql';

export default compose(
  graphql(GET_SETTINGS, { name: 'getSettings' }),
  branch(
    ({ getSettings: { settings }}) => !settings,
    renderNothing
  ),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Setting' }
    ],
    languages: [
      { key: 'en', title: 'English' },
      { key: 'vi', title: 'Vietnamese' }
    ]
  })),
  withHandlers({
    initValue: ({ getSettings: { settings = [] } }) => (formApi) => {
      const listSettings = ['language', 'company_name'];
      for (const setting of listSettings) {
        formApi.setValue(setting, (settings.find(item => item.settingKey === setting) || {}).settingValue);  
      }
    }
  })
)(AdminContentSettingComponent);