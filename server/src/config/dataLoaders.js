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

const getPostsByIds = postIds => {
  const params = postIds.map(id => `'${id}'`).join(', ');
  return promiseQuery(`SELECT * FROM ${PREFIX}post WHERE id IN (${params})`);
}

const getCategoriesByIds = categoryIds => {
  const params = categoryIds.map(id => `'${id}'`).join(', ');
  return promiseQuery(`SELECT * FROM ${PREFIX}category WHERE id IN (${params})`);
}

const getPackagesByIds = packageIds => {
  const params = packageIds.map(id => `'${id}'`).join(', ');
  return promiseQuery(`SELECT * FROM ${PREFIX}package WHERE id IN (${params})`);
}

export default {
  rolesByIds: new DataLoader(getRolesByIds),
  usersByIds: new DataLoader(getUsersByIds),
  postsByIds: new DataLoader(getPostsByIds),
  categoriesByIds: new DataLoader(getCategoriesByIds),
  packagesByIds: new DataLoader(getPackagesByIds)
}