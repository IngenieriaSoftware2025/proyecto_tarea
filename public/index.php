<?php 
require_once __DIR__ . '/../includes/app.php';


use MVC\Router;
use Controllers\AppController;
use Controllers\ClienteController;

$router = new Router();
$router->setBaseURL('/' . $_ENV['APP_NAME']);

$router->get('/', [AppController::class,'index']);


$router->post('/clientes/guardarCliente', [ClienteController::class, 'guardarCliente']);

$router->comprobarRutas();
