import jwt from 'jsonwebtoken';
import { PREFIX, promiseQuery } from './database';

const SECRET = '@saigonweb';

export async function createToken(payload) {
  const obj = Object.assign({}, payload);
  return jwt.sign(obj, SECRET);
}

export function verifyToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  }
  catch (e) {
    return null;
  }
}