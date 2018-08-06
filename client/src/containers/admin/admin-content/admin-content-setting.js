import { compose, withProps, withHandlers, branch, renderNothing, withState } from 'recompose';
import { graphql } from 'react-apollo';

import AdminContentSettingComponent from '../../../components/admin/admin-content/admin-content-setting';
import { GET_SETTINGS, EDIT_SETTING } from '../../../utils/graphql';
import { ALERT_STATUS } from '../../../utils/enum';

export default compose(
  graphql(GET_SETTINGS, { name: 'getSettings' }),
  graphql(EDIT_SETTING, { name: 'editSettings' }),
  branch(
    ({ getSettings: { settings }}) => !settings,
    renderNothing
  ),
  withProps(() => ({
    breadcrumbItems: [
      { url: '/dashboard', icon: 'home', text: 'categories.home' },
      { text: 'categories.settings' }
    ],
    languages: [
      { key: 'en', title: 'languages.english' },
      { key: 'vi', title: 'languages.vietnamese' }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    initValue: ({ getSettings: { settings = [] } }) => (formApi) => {
      const listSettings = ['company_name'];

      if (!localStorage.getItem('language')) localStorage.setItem('language', 'vi');
      const language = localStorage.getItem('language');

      for (const setting of listSettings) {
        formApi.setValue(setting, (settings.find(item => item.settingKey === setting) || {}).settingValue);
      }
      formApi.setValue('language', language);
    },
    submitForm: ({ editSettings, setAlertContent, setAlert }) => async data => {
      const dataParsed = Object.keys(data).filter(item => item !== 'language').map(item => ({
        settingKey: item,
        settingValue: data[item]
      }));

      localStorage.setItem('language', data.language);

      try {
        await editSettings({ variables: { listSettings: JSON.stringify(dataParsed) } });

        setAlertContent('success.save_settings');
        setAlert(ALERT_STATUS.SUCCESS);
      }
      catch (e) {
        setAlertContent(e.graphQLErrors[0].message);
        setAlert(ALERT_STATUS.ERROR);
      }
    }
  })
)(AdminContentSettingComponent);