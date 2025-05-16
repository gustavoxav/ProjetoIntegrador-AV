<?php
require_once 'vendor/autoload.php';


use \phputil\router\Router;
use function \phputil\cors\cors;

define('API_PREFIX', '/api');

$app = new Router();
$app->use(cors(['origin' => 'http://localhost:5173']));
$pdo = conectarPDO();

// $app->get(API_PREFIX . "/hello", function ($req, $res) {
//   try {
//     $res->send("Hello world");
//   } catch (Exception $e) {
//     $res->status(500)->json([$e->getMessage()]);
//   }
// });

$app->get(API_PREFIX . "/clientesFiltro/:filtro", function ($req, $res) use ($pdo) {
  $params = $req->params();
  $filtro = $params['filtro'] ?? null;

  try {
    $gestor = new GestorCliente(
      new RepositorioClienteEmBDR($pdo)
    );
    $saida = $gestor->obterClientes($filtro);
    $res->json($saida);
  } catch (Exception $e) {
    $res->status(500)->json([$e->getMessage()]);
  }
});

$app->get(API_PREFIX . "/clientes", function ($req, $res) use ($pdo) {

  try {
    $gestor = new GestorCliente(
      new RepositorioClienteEmBDR($pdo)
    );
    $saida = $gestor->obterClientes(null);
    $res->json($saida);
  } catch (Exception $e) {
    $res->status(500)->json([$e->getMessage()]);
  }
});

$app->listen();
