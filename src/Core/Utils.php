<?php
namespace SaiGonWeb\Core;

class Utils {
  public static function write_php_ini($assoc_arr, $filename) {
    $content = "";

    foreach ($assoc_arr as $section => $ini) {
      $content .= "[" . $section . "]\n";

      foreach ($ini as $key => $val) {
        $content .= $key . " = " . $val . "\n";
      }
    }

    try {
      $handle = fopen($filename, 'w');
      $success = fwrite($handle, $content);
      fclose($handle);

      return $success;
    }
    catch (Exception $e) {
      return false;
    }
  }
}