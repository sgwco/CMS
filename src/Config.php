<?php
namespace SaiGonWeb;

use \SaiGonWeb\Core\Utils;

class Config {
  private static $_HOST = 'localhost';
  private static $_PORT = '5432';
  private static $_DBNAME = 'sgwcms';
  private static $_USER = 'saigonweb';
  private static $_PASS = '123456';

  public static function create_config_database() {
    $arr = array(
      'database' => array(
        'host' => static::$_HOST,
        'port' => static::$_PORT,
        'dbname' => static::$_DBNAME,
        'user' => static::$_USER,
        'password' => static::$_PASS
      )
    );
    Utils::write_php_ini($arr, './config.ini');
  }
}