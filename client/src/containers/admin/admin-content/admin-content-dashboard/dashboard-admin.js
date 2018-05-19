import { compose, withProps, branch, renderNothing, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import moment from 'moment';

import DashboardAdmin from '../../../../components/admin/admin-content/admin-content-dashboard/dashboard-admin';
import { GET_USER_TOKEN, GET_ALL_PACKAGES, GET_FULL_USERS } from '../../../../utils/graphql';
import { checkRoleIsAllowed } from '../../../../utils/utils';
import { ROLE_CAPABILITIES } from '../../../../utils/enum';

export default compose(
  graphql(GET_USER_TOKEN, { name: 'getUserToken' }),
  branch(
    ({getUserToken: { loggedInUser = {} }}) =>
      Object.keys(loggedInUser).length === 0 || checkRoleIsAllowed(loggedInUser.role.accessPermission, ROLE_CAPABILITIES.write_packages.value) === 0,
    renderNothing
  ),
  graphql(GET_ALL_PACKAGES, { name: 'listPackages' }),
  graphql(GET_FULL_USERS, { name: 'getUsers' }),
  withHandlers({
    priceCalculate: () => (packages, year) => {
      const results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const currentYearPackages = packages.filter(item => moment(item.registerDate).year() === year);
      for (let index = 0; index < currentYearPackages.length; index += 1) {
        const item = currentYearPackages[index];
        const itemDate = moment(item.registerDate);
        results[itemDate.month()] += item.price * 1000;
      }
      return results;
    }
  }),
  withProps(({ listPackages: { packages = [] } }) => ({
    breadcrumbItems: [
      { url: '/admin', icon: 'home', text: 'Home' },
      { text: 'Dashboard' }
    ],
    currentYear: moment().year(),
    listActivePackages: packages.filter(item => item.status !== 'EXPIRED' && item.status !== 'PENDING'),
    
  })),
  withProps(({ currentYear, listPackages: { packages = [] }, priceCalculate }) => ({
    pieChartData: {
      labels: [
        'Pending',
        'Active',
        'Wait for Expiration',
        'Expired'
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
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      datasets: [{
        label: `Total price in ${currentYear}`,
        data: priceCalculate(packages, currentYear),
        backgroundColor: '#00b894'
      }]
    }
  })),
  withState('selectedPackageIndex', 'selectPackageAction', -1)
)(DashboardAdmin);