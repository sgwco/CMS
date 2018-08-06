import mysql from 'mysql';
import moment from 'moment';
import sha1 from 'sha1';

import { ROLE_CAPABILITIES } from '../enum';

export const PREFIX = 'sgw_';
export const CONFIG = {
  production: {
    "HOSTING": "127.0.0.1",
    "USER": "alphawh_admin",
    "PASSWORD": "alphawh_admin",
    "DATABASE": "alphawh_admin"
  },
  development: {
    "HOSTING": "127.0.0.1",
    "USER": "root",
    "PASSWORD": "password",
    "DATABASE": "sgw_cms"
  }
}
const env = process.env.NODE_ENV || 'development';
const CONFIG_ENV = CONFIG[env]

export const connection = mysql.createConnection({
  host: CONFIG_ENV.HOSTING,
  user: CONFIG_ENV.USER,
  password: CONFIG_ENV.PASSWORD
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

async function initData() {
  // Full access role
  await promiseQuery(`INSERT IGNORE INTO ${PREFIX}role (name, access_permission) VALUES (
    'Admin',
    ${Object.keys(ROLE_CAPABILITIES).map(item => ROLE_CAPABILITIES[item].value).reduce((total, item) => total + item, 0)}
  )`);

  const adminRole = await promiseQuery(`SELECT id FROM ${PREFIX}role WHERE name='Admin'`);
  if (adminRole.length > 0) {
    // Root user
    promiseQuery(`INSERT IGNORE INTO ${PREFIX}user (username, password, registration_date, role, user_status)
    VALUES (
      'admin',
      '${sha1('123456')}',
      '${moment().format('YYYY-MM-DD')}',
      '${adminRole[0].id}',
      'active'
    )`);
  }

  promiseQuery(`INSERT IGNORE INTO ${PREFIX}setting (setting_key, setting_value) VALUES ('language', 'vi'), ('company_name', 'Sai Gon Web')`);
}

export async function initDatabase(conn) {
  await promiseQuery(`CREATE DATABASE IF NOT EXISTS ${CONFIG_ENV.DATABASE}`);
  conn.changeUser({
    database: CONFIG_ENV.DATABASE
  }, async err => {
    // Role table
    await promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}role (
      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL UNIQUE,
      access_permission BIGINT UNSIGNED NOT NULL
    )`);

    // Post table
    // promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}post (
    //   id VARCHAR(50) NOT NULL PRIMARY KEY,
    //   title VARCHAR(1000) NOT NULL,
    //   content LONGTEXT NOT NULL,
    //   excerpt LONGTEXT NOT NULL,
    //   author VARCHAR(50) NOT NULL,
    //   slug VARCHAR(1000) NOT NULL UNIQUE,
    //   category VARCHAR(8000) NOT NULL,
    //   thumbnail VARCHAR(50),
    //   count INT(10) UNSIGNED DEFAULT 0,
    //   publish_date DATETIME NOT NULL
    // )`);

    // // Category table
    // promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}category (
    //   id VARCHAR(50) NOT NULL PRIMARY KEY,
    //   name VARCHAR(1000) NOT NULL,
    //   slug VARCHAR(1000) NOT NULL UNIQUE,
    //   parent VARCHAR(50),
    //   description LONGTEXT NOT NULL,
    //   thumbnail VARCHAR(50) NOT NULL
    // )`);

    // // Media Meta table
    // promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}media_meta (
    //   id VARCHAR(50) NOT NULL PRIMARY KEY,
    //   name VARCHAR(1000) NOT NULL,
    //   value VARCHAR(2000)
    // )`);

    // User table
    await promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}user (
      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(50) NOT NULL,
      fullname VARCHAR(100),
      email VARCHAR(200),
      registration_date DATETIME NOT NULL,
      role INT UNSIGNED NOT NULL,
      address VARCHAR(200),
      phone VARCHAR(50),
      user_status VARCHAR(20) NOT NULL DEFAULT 'active',
      CONSTRAINT FK_ROLE FOREIGN KEY (role) REFERENCES ${PREFIX}role(id) ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}user_meta (
      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      user_id INT UNSIGNED NOT NULL,
      meta_key VARCHAR(50) NOT NULL,
      meta_value VARCHAR(200) NOT NULL,
      CONSTRAINT FK_USER FOREIGN KEY (user_id) REFERENCES ${PREFIX}user(id) ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    // Media table
    promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}media (
      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      url VARCHAR(200) NOT NULL,
      upload_date DATETIME NOT NULL,
      upload_by INT UNSIGNED NOT NULL,
      CONSTRAINT FK_MEDIA_USER FOREIGN KEY (upload_by) REFERENCES ${PREFIX}user(id) ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    // Package table
    await promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}package (
      package_id VARCHAR(50) NOT NULL PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      price BIGINT UNSIGNED NOT NULL,
      currency VARCHAR(10) NOT NULL,
      duration INT(10) UNSIGNED NOT NULL,
      introducer INT UNSIGNED NULL,
      register_date DATE NOT NULL,
      status VARCHAR(50) NOT NULL,
      CONSTRAINT FK_PACKAGE FOREIGN KEY (user_id) REFERENCES ${PREFIX}user(id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT FK_INTRODUCER FOREIGN KEY (introducer) REFERENCES ${PREFIX}user(id) ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}package_progress (
      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      package_id VARCHAR(50) NOT NULL,
      amount FLOAT(10, 2) UNSIGNED NOT NULL,
      interest_rate INT UNSIGNED NOT NULL,
      date DATE NOT NULL,
      status BOOLEAN NOT NULL,
      withdraw_date DATE,
      CONSTRAINT FK_PACKAGE_PROGRESS FOREIGN KEY (package_id) REFERENCES ${PREFIX}package(package_id) ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    await promiseQuery(`CREATE TABLE IF NOT EXISTS ${PREFIX}setting (
      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      setting_key VARCHAR(100) NOT NULL UNIQUE,
      setting_value VARCHAR(200) NOT NULL
    )`);

    initData();
  });
}