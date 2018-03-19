<?php
namespace SaiGonWeb\Core;

class Connection {
  private static $connection;

  public static function connect() {
    try {
      $config = parse_ini_file('./config.ini', true);
      $database = $config['database'];
      $connect_string = sprintf("pgsql:host=%s;port=%s;dbname=%s;user=%s;password=%s",
        $database['host'], $database['port'], $database['dbname'], $database['user'], $database['password']);
      static::$connection = new \PDO($connect_string);

      echo 'A connection to the PostgreSQL database server has been established successfully.';
    }
    catch (PDOException $e) {
      echo $e->getMessage();
    }
  }

  public static function get() {
    return static::$connection;
  }
}