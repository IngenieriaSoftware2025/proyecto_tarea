<?php

namespace Controllers;

use MVC\Router;
use Model\ActiveRecord;
use Model\Clientes;
use Exception;


class ClienteController extends ActiveRecord
{

    public static function renderizarPagina(Router $router)
    {
        $router->render('clientes/index', []);
    }








    public static function guardarAPI()
    {
        getHeadersApi();

        if (empty($_POST['cliente_nombres'])) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El cliente_nombres del cliente es obligatorio'
            ]);
            return;
        }

        if (empty($_POST['cliente_apellidos'])) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El cliente_apellidos del cliente es obligatorio'
            ]);
            return;
        }

        if (strlen($_POST['cliente_telefono']) != 8) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'telefono debe tener 8 digitos'
            ]);
            return;
        }

        if (!empty($_POST['cliente_correo']) && !filter_var($_POST['cliente_correo'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El correo electrónico no es válido'
            ]);
            return;
        }

        try {
            $_POST['cliente_nombres'] = ucwords(strtolower(trim(htmlspecialchars($_POST['cliente_nombres']))));
            $_POST['cliente_apellidos'] = ucwords(strtolower(trim(htmlspecialchars($_POST['cliente_apellidos']))));
             $_POST['cliente_nit'] = htmlspecialchars($_POST['cliente_nit'] ?? '');
            $_POST['cliente_telefono'] = filter_var($_POST['cliente_telefono'], FILTER_SANITIZE_NUMBER_INT);
           
            $_POST['cliente_correo'] = filter_var($_POST['cliente_correo'], FILTER_SANITIZE_EMAIL);

            $cliente = new Clientes([
                'cliente_nombres' => $_POST['cliente_nombres'],
                'cliente_apellidos' => $_POST['cliente_apellidos'],
                'cliente_nit' => $_POST['cliente_nit'],
                'cliente_telefono' => $_POST['cliente_telefono'],
                'cliente_correo' => $_POST['cliente_correo'],
                'cliente_situacion' => 1
            ]);

            $crear = $cliente->crear();

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Cliente guardado exitosamente'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al guardar el cliente',
                'detalle' => $e->getMessage()
            ]);
        }
    }














    public static function buscarAPI()
    {
        getHeadersApi();
        try {
            $consulta = "SELECT * FROM clientes WHERE cliente_situacion = 1 ORDER BY cliente_nombres";
            $cliente = self::fetchArray($consulta);

            if (count($cliente) > 0) {
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'exito al buscar',
                    'data' => $cliente
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'error al buscar',
                    'data' => 'no hay clientes'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'error de conexion',
                    'detalle' => $e->getMessage()
                ]);
        }
    }










    public static function ModificarAPI(){
        getHeadersApi();
        $id = $_POST['cliente_id'];
         if (empty($_POST['cliente_nombres'])) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El cliente_nombres del cliente es obligatorio'
            ]);
            return;
        }

        if (empty($_POST['cliente_apellidos'])) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El cliente_apellidos del cliente es obligatorio'
            ]);
            return;
        }

        if (strlen($_POST['cliente_telefono']) != 8) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'telefono debe tener 8 digitos'
            ]);
            return;
        }

        if (!empty($_POST['cliente_correo']) && !filter_var($_POST['cliente_correo'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El correo electrónico no es válido'
            ]);
            return;
        }


        try {
            $data = Clientes::find($id);
            $data->sincronizar(
                [
                     'cliente_nombres' => $_POST['cliente_nombres'],
                'cliente_apellidos' => $_POST['cliente_apellidos'],
                'cliente_nit' => $_POST['cliente_nit'],
                'cliente_telefono' => $_POST['cliente_telefono'],
                'cliente_correo' => $_POST['cliente_correo'],
                'cliente_situacion' => 1
                ]

                );
                $data->actualizar();
                
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje'=>'exito al acualizar',
            ]);
            
            } catch (Exception $e) {
                http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje'=>'eror al acualizar',
                'detalle'=> $e->getMessage()
            ]);
       
        }
    }

    public static function eliminarAPI()
    {
        try {
            $id = filter_var($_POST['cliente_id'], FILTER_SANITIZE_NUMBER_INT);
             $sql = "UPDATE clientes SET cliente_situacion = 0 WHERE cliente_id = $id";
         self::SQL($sql);
          

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'El libro ha sido eliminado correctamente'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al eliminar',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

   
}

