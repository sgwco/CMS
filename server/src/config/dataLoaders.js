import DataLoader from 'dataloader';
import { promiseQuery, PREFIX } from './database';

const getRolesByIds = roleIds => {
  const params = roleIds.map(id => `'${id}'`).join(', ');
  return promiseQuery(`SELECT * FROM ${PREFIX}role WHERE id IN (${params})`);
}

const getUsersByIds = userIds => {
  const params = userIds.map(id => `'${id}'`).join(', ');
  return promiseQuery(`SELECT * FROM ${PREFIX}user WHERE id IN (${params})`);
}

export default {
  rolesByIds: new DataLoader(getRolesByIds),
  usersByIds: new DataLoader(getUsersByIds)
}