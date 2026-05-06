<?php

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

use App\Core\Database;
use App\Core\Router;
use App\Core\Response;
use App\Controllers\UserController;
use App\Controllers\DashboardController;
use App\Controllers\SupportController;

Database::boot();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$router = new Router();

$router->addRoute('POST', '/users/login', [UserController::class, 'login']);
$router->addRoute('POST', '/users/register', [UserController::class, 'register']);
$router->addRoute('POST', '/users/reset-password', [UserController::class, 'resetPassword']);
$router->addRoute('GET', '/users', [UserController::class, 'index']);
$router->addRoute('GET', '/dashboard/{id}', [DashboardController::class, 'getSummary']);
$router->addRoute('POST', '/support/tickets', [SupportController::class, 'create']);

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

$router->dispatch($method, $uri);
