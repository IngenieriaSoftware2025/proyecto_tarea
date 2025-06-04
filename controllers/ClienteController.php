<?php

namespace Controllers;

use MVC\Router;
use Model\ActiveRecord;
use Model\Clientes;


class ClienteController extends ActiveRecord{

    public static function renderizarPagina(Router $router)
    {
        $router->render('clientes/index', []);
    }

    public static function guardarCliente (){
        getHeadersApi();
        echo json_encode($_POST);
    }
}