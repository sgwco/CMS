import { compose, withProps, branch, renderNothing } from 'recompose';
import { graphql } from 'graphql';

import AdminContentDashboardComponent from '../../../components/admin/admin-content/admin-content-dashboard';
import { EDIT_SETTING } from '../../../utils/graphql';
import lang from '../../../languages';
import { SETTING_KEYS } from '../../../utils/enum';

export default compose(
  graphql(EDIT_SETTING, { name: 'editSettings' }),
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
  })),
)(AdminContentDashboardComponent);