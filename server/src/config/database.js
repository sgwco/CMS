import mysql from 'mysql';
import uuid from 'uuid/v1';
import moment from 'moment';

const HOSTING = '127.0.0.1';
const USER = 'root';
const PASSWORD = '';
const DATABASE = 'sgw_cms';
export const PREFIX = 'sgw_';

export const connection = mysql.createConnection({
  host: HOSTING,
  user: USER,
  password: PASSWORD
});

export function promiseQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    })
  });
}

export async function initDatabase(conn) {
  await promiseQuery(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`);
  conn.changeUser({
    database: DATABASE
  }, async err => {
    // Role table
    await promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}role (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      access_permission BIGINT UNSIGNED NOT NULL
    )`);

    // Post table
    promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}post (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      title VARCHAR(1000) NOT NULL,
      content LONGTEXT NOT NULL,
      excerpt LONGTEXT NOT NULL,
      author VARCHAR(50) NOT NULL,
      slug VARCHAR(1000) NOT NULL UNIQUE,
      category VARCHAR(8000) NOT NULL,
      thumbnail VARCHAR(50),
      count INT(10) UNSIGNED DEFAULT 0,
      publish_date DATETIME NOT NULL
    )`);

    // Category table
    promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}category (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      name VARCHAR(1000) NOT NULL,
      slug VARCHAR(1000) NOT NULL UNIQUE,
      parent VARCHAR(50),
      description LONGTEXT NOT NULL,
      thumbnail VARCHAR(50) NOT NULL
    )`);

    // Media table
    promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}media (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      name VARCHAR(1000) NOT NULL,
      url VARCHAR(2000) NOT NULL,
      type VARCHAR(50) NOT NULL,
      upload_date DATETIME NOT NULL,
      upload_by VARCHAR(50) NOT NULL
    )`);

    // Media Meta table
    promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}media_meta (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      name VARCHAR(1000) NOT NULL,
      value VARCHAR(2000)
    )`);

    // User table
    promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}user (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(50) NOT NULL,
      fullname VARCHAR(100) NOT NULL,
      email VARCHAR(200) NOT NULL UNIQUE,
      registration_date DATETIME NOT NULL,
      role VARCHAR(50) NOT NULL,
      address VARCHAR(200) DEFAULT '',
      phone VARCHAR(50) DEFAULT '',
      user_status VARCHAR(20) NOT NULL DEFAULT 'active',
      CONSTRAINT FK_ROLE FOREIGN KEY (role) REFERENCES ${PREFIX}role(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )`);
  });
}