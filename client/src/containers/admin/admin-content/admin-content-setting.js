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
      { url: '/admin/dashboard', icon: 'home', text: 'Home' },
      { text: 'Setting' }
    ],
    languages: [
      { key: 'en', title: 'English' },
      { key: 'vi', title: 'Vietnamese' }
    ]
  })),
  withState('alertVisible', 'setAlert', ALERT_STATUS.HIDDEN),
  withState('alertContent', 'setAlertContent', ''),
  withHandlers({
    removeAlert: ({ setAlert }) => () => setAlert(ALERT_STATUS.HIDDEN),
    initValue: ({ getSettings: { settings = [] } }) => (formApi) => {
      const listSettings = ['language', 'company_name'];
      for (const setting of listSettings) {
        formApi.setValue(setting, (settings.find(item => item.settingKey === setting) || {}).settingValue);
      }
    },
    submitForm: ({ editSettings, setAlertContent, setAlert }) => async data => {
      const dataParsed = Object.keys(data).map(item => ({
        settingKey: item,
        settingValue: data[item]
      }));

      try {
        await editSettings({ variables: { listSettings: JSON.stringify(dataParsed) } });

        setAlertContent('Edit settings successfully. Please refresh this page to apply settings.');
        setAlert(ALERT_STATUS.SUCCESS);
      }
      catch (e) {
        setAlertContent('Error: ' + e.graphQLErrors[0].message);
        setAlert(ALERT_STATUS.ERROR);
      }
    }
  })
)(AdminContentSettingComponent);