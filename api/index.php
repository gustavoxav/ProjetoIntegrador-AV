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

// GET /api/clientes: Retorna todos os clientes cadastrados no sistema
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

// GET /api/clientes/:filtro: Busca clientes por CPF ou código específico
$app->get(API_PREFIX . "/clientes/:filtro", function ($req, $res) use ($pdo) {
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

// GET /api/funcionarios: Retorna todos os funcionários cadastrados no sistema
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

// GET /api/funcionarios/:filtro: Busca funcionários por código ou nome específico
$app->get(API_PREFIX . "/funcionarios/:filtro", function ($req, $res) use ($pdo) {
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

// GET /api/equipamentos: Retorna todos os equipamentos
$app->get(API_PREFIX . "/equipamentos", function ($req, $res) use ($pdo) {
  try {
    $gestor = new GestorEquipamento(
      new RepositorioEquipamentoEmBDR($pdo)
    );
    $saida = $gestor->obterEquipamentos(null);
    $res->json($saida);
  } catch (Exception $e) {
    $res->status(500)->json([$e->getMessage()]);
  }
});

// GET /api/equipamentos/:filtro: Busca equipamentos por critério específico
$app->get(API_PREFIX . "/equipamentos/:filtro", function ($req, $res) use ($pdo) {
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

// POST /api/locacoes: Registra uma nova locação
$app->post(API_PREFIX . "/locacoes", function ($req, $res) use ($pdo) {
  $dadosLocacao = (array) $req->body();

  try {
    $gestor = new GestorLocacao(
      new RepositorioLocacaoEmBDR($pdo)
    );
    $saida = $gestor->registrarLocacao($dadosLocacao);
    $res->status(201)->json($saida);
  } catch (Exception $e) {
    $res->status(400)->json(["erro" => $e->getMessage()]);
  }
});

// GET /api/locacoes: Retorna todas as locações cadastradas no sistema
$app->get(API_PREFIX . "/locacoes", function ($req, $res) use ($pdo) {
  try {
    $gestor = new GestorLocacao(
      new RepositorioLocacaoEmBDR($pdo)
    );
    $saida = $gestor->obterLocacoes(null);
    $res->json($saida);
  } catch (Exception $e) {
    $res->status(500)->json(["erro" => $e->getMessage()]);
  }
});

// GET /api/locacoes/:filtro: Busca uma locação pelo código ou por filtro
$app->get(API_PREFIX . "/locacoes/:filtro", function ($req, $res) use ($pdo) {
  $params = $req->params();
  $filtro = $params['filtro'] ?? null;

  try {
    $gestor = new GestorLocacao(
      new RepositorioLocacaoEmBDR($pdo)
    );
    $saida = $gestor->obterLocacaoPorFiltro($filtro);
    
    if (!$saida) {
      $res->status(404)->json(["erro" => "Locação não encontrada"]);
      return;
    }
    
    $res->json($saida);
  } catch (Exception $e) {
    $res->status(500)->json(["erro" => $e->getMessage()]);
  }
});

$app->listen();
