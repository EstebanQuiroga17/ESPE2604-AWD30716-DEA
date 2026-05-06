<?php
require 'vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();
App\Core\Database::boot();
$c = Illuminate\Database\Capsule\Manager::connection();
$cols = $c->select('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'support_tickets\'');
print_r($cols);
