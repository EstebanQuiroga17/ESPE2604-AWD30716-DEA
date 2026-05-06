<?php

namespace App\Core;

use Illuminate\Database\Capsule\Manager as Capsule;

class Database
{
    public static function boot(): void
    {
        $capsule = new Capsule;

        $capsule->addConnection([
            'driver'    => 'pgsql',
            'host'      => $_ENV['DB_HOST'] ?? 'localhost',
            'port'      => $_ENV['DB_PORT'] ?? '5432',
            'database'  => $_ENV['DB_NAME'] ?? 'postgres',
            'username'  => $_ENV['DB_USER'] ?? 'root',
            'password'  => $_ENV['DB_PASS'] ?? '',
            'charset'   => 'utf8',
            'prefix'    => '',
            'schema'    => 'public',
        ]);

        $capsule->setAsGlobal();
        $capsule->bootEloquent();
    }
}
