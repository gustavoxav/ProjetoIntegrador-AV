<?php
require_once 'vendor/autoload.php';

use \phputil\router\Router;
use function \phputil\cors\cors;

define('API_PREFIX', '/api');

$app = new Router();

$app->use(cors([
  'origin' => ['http://localhost:5173', 'http://localhost:8080'],
  'allowedHeaders' => ['Host', 'Origin', 'Accept', 'Content-Type', 'Content-Length', 'Cookie'],
  'exposeHeaders' => ['Content-Type', 'Content-Length', 'Set-Cookie']
]));

$pdo = conectarPDO();

// CLIENTES TODOS
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

// CLIENTES FILTRO
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

// FUNCIONARIOS TODOS
$app->get(API_PREFIX . "/funcionarios", function ($req, $res) use ($pdo) {
  try {
    $gestor = new GestorFuncionario(
      new RepositorioFuncionarioEmBDR($pdo)
    );
    $saida = $gestor->obterFuncionarios(null);
    $res->json($saida);
  } catch (Exception $e) {
    $res->status(500)->json([$e->getMessage()]);
  }
});

// FUNCIONARIOS FILTRO
$app->get(API_PREFIX . "/funcionariosFiltro/:filtro", function ($req, $res) use ($pdo) {
  $params = $req->params();
  $filtro = $params['filtro'] ?? null;

  try {
    $gestor = new GestorFuncionario(
      new RepositorioFuncionarioEmBDR($pdo)
    );
    $saida = $gestor->obterFuncionarios($filtro);
    $res->json($saida);
  } catch (Exception $e) {
    $res->status(500)->json([$e->getMessage()]);
  }
});

$app->get(API_PREFIX . "/equipamentoFiltro/:filtro", function ($req, $res) use ($pdo) {
  $params = $req->params();
  $filtro = $params['filtro'] ?? null;

  try {
    $gestor = new GestorEquipamento(
      new RepositorioEquipamentoEmBDR($pdo)
    );
    $saida = $gestor->obterEquipamentos($filtro);
    $res->json($saida);
  } catch (Exception $e) {
    $res->status(500)->json([$e->getMessage()]);
  }
});


$app->listen();
