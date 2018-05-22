import { compose, withProps, branch, renderNothing } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentDashboardComponent from '../../../components/admin/admin-content/admin-content-dashboard';
import { GET_SETTINGS } from '../../../utils/graphql';
import lang from '../../../languages';
import { SETTING_KEYS } from '../../../utils/enum';

export default compose(
  graphql(GET_SETTINGS, { name: 'getSettings' }),
  branch(
    ({ getSettings: { settings }}) => !settings,
    renderNothing
  ),
  withProps(({ getSettings: { settings = [] }}) => ({
    language: (settings.find(item => item.settingKey === SETTING_KEYS.LANGUAGE) || {}).settingValue
  })),
  withProps(({ language }) => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: lang('home', language) },
      { text: lang('dashboard', language) }
    ]
  }))
)(AdminContentDashboardComponent);