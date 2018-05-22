import { compose, withProps, branch, renderNothing, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import moment from 'moment';

import DashboardAdmin from '../../../../components/admin/admin-content/admin-content-dashboard/dashboard-admin';
import { GET_USER_TOKEN, GET_ALL_PACKAGES, GET_FULL_USERS, GET_SETTINGS } from '../../../../utils/graphql';
import { checkRoleIsAllowed, getKeyAsString } from '../../../../utils/utils';
import { ROLE_CAPABILITIES, SETTING_KEYS, PACKAGE_STATUS } from '../../../../utils/enum';
import lang from '../../../../languages';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  graphql(GET_SETTINGS, { name: 'getSettings' }),
  branch(
    ({getUserToken: { loggedInUser = {} }}) =>
      Object.keys(loggedInUser).length === 0 || checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.write_packages.value) === 0,
    renderNothing
  ),
  graphql(GET_ALL_PACKAGES, { name: 'listPackages' }),
  graphql(GET_FULL_USERS, { name: 'getUsers' }),
  withHandlers({
    priceCalculate: () => (packages, year, packageStatus) => {
      const results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const currentYearPackages = packages.filter(item => moment(item.registerDate).year() === year && item.status === packageStatus);
      for (let index = 0; index < currentYearPackages.length; index += 1) {
        const item = currentYearPackages[index];
        const itemDate = moment(item.registerDate);
        results[itemDate.month()] += item.price * 1000;
      }
      return results;
    }
  }),
  withProps(({ getSettings: { settings = [] }}) => ({
    language: (settings.find(item => item.settingKey === SETTING_KEYS.LANGUAGE) || {}).settingValue
  })),
  withProps(({ listPackages: { packages = [] } }) => ({
    currentYear: moment().year(),
    listActivePackages: packages.filter(item => item.status !== 'EXPIRED' && item.status !== 'PENDING'),
    
  })),
  withProps(({ currentYear, listPackages: { packages = [] }, priceCalculate, language }) => ({
    pieChartData: {
      labels: [
        lang('pending', language),
        lang('active', language),
        lang('wait_for_expiration', language),
        lang('expired', language)
      ],
      datasets: [{
        data: [
          packages.filter(item => item.status === 'PENDING').length,
          packages.filter(item => item.status === 'ACTIVE').length,
          packages.filter(item => item.status === 'PENDING_EXPIRED').length,
          packages.filter(item => item.status === 'EXPIRED').length,
        ],
        backgroundColor: [
          '#00b894',
          '#0984e3',
          '#d63031',
          '#fdcb6e'
        ],
      }]
    },
    barData: {
      labels: [
        lang('january', language),
        lang('february', language),
        lang('march', language),
        lang('april', language),
        lang('may', language),
        lang('june', language),
        lang('july', language),
        lang('august', language),
        lang('september', language),
        lang('october', language),
        lang('november', language),
        lang('december', language)
      ],
      datasets: [
        {
          label: lang('pending', language),
          data: priceCalculate(packages, currentYear, getKeyAsString(PACKAGE_STATUS.PENDING, PACKAGE_STATUS)),
          backgroundColor: '#00b894'
        },
        {
          label: lang('active', language),
          data: priceCalculate(packages, currentYear, getKeyAsString(PACKAGE_STATUS.ACTIVE, PACKAGE_STATUS)),
          backgroundColor: '#0984e3'
        },
        {
          label: lang('wait_for_expiration', language),
          data: priceCalculate(packages, currentYear, getKeyAsString(PACKAGE_STATUS.PENDING_EXPIRED, PACKAGE_STATUS)),
          backgroundColor: '#d63031'
        },
        {
          label: lang('expired', language),
          data: priceCalculate(packages, currentYear, getKeyAsString(PACKAGE_STATUS.EXPIRED, PACKAGE_STATUS)),
          backgroundColor: '#fdcb6e'
        }
      ]
    }
  })),
  withState('selectedPackageIndex', 'selectPackageAction', -1)
)(DashboardAdmin);