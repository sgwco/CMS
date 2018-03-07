<?php
require_once __DIR__ . '/vendor/autoload.php';

use \GraphQL\Error\Debug;
use \GraphQL\GraphQL;
use \SaiGonWeb\Config;

if (file_exists('./config.ini')) {
  
}
else {
  Config::create_config_database();
}

if (!empty($_GET['debug'])) {
  set_error_handler(function($severity, $message, $file, $line) use (&$phpErrors) {
    throw new ErrorException($message, 0, $severity, $file, $line);
  });
  $debug = Debug::INCLUDE_DEBUG_MESSAGE || Debug::INCLUDE_TRACE;
}

try {
  $result = GraphQL::executeQuery();
}
catch (\Exception $error) {

}