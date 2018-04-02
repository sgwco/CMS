import DataLoader from 'dataloader';
import { promiseQuery, PREFIX } from './config/database';

export const getUserById = new DataLoader(ids => {
  const params = ids.map(id => `'${id}'`).join(', ');
  const query = promiseQuery(`SELECT * FROM ${PREFIX}user WHERE id IN (${params})`);
})