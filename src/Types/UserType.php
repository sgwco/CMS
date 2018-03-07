<?php
namespace SaiGonWeb\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class UserType extends ObjectType {
  public function __construct() {
    $config = [
      'name' => 'User',
      'fields' => [
        'id' => Type::id(),
        'username' => Type::string(),
        'password' => Type::string(),
        'fullname' => Type::string(),
        'registerAt' => Type::string(),
        'email' => Type::string(),
        'role' => Type::int(),
        'address' => Type::string(),
        'phone' => Type::string(),
        'status' => Type::int()
      ]
    ];
    parent::__construct($config);
  }
}