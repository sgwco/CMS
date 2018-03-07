<?php
namespace SaiGonWeb\Core;

class Utils {
  private static $_CONFIG_INI_NAME = './config.ini';

  public static function write_php_ini($assoc_arr) {
    $content = "";

    foreach ($assoc_arr as $section => $ini) {
      $content .= " [" . $section . "]\n";

      foreach ($ini as $key => $val) {
        $content .= $key . " = \"" . $val . "\"\n";
      }
    }

    try {
      $handle = fopen(Utils::$_CONFIG_INI_NAME, 'w');
      $success = fwrite($handle, $content);
      fclose($handle);

      return $success;
    }
    catch (Exception $e) {
      return false;
    }
  }
}