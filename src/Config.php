<?php
namespace SaiGonWeb;

use \SaiGonWeb\Core\Utils;

class Config {
  private static $_HOST = 'localhost';
  private static $_DBNAME = '_sgw_cms';
  private static $_USER = 'www';
  private static $_PASS = 'foo';

  public static function create_config_database() {
    $arr = array(
      'database' => array(
        'host' => Config::$_HOST,
        'dbname' => Config::$_DBNAME,
        'user' => Config::$_USER,
        'password' => Config::$_PASS
      )
    );
    Utils::write_php_ini($arr);
  }
}