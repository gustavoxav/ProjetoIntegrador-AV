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

// POST /api/login: Realiza o login no sistema
$app->post("/login", function ($req, $res) use ($pdo) {
  try {
    $dados = (array) $req->body();
    $cpf = $dados['cpf'] ?? '';
    $senha = $dados['senha'] ?? '';

    $gestor = new GestorFuncionario(new RepositorioFuncionarioEmBDR($pdo));
    $funcionario = $gestor->login($cpf, $senha);
    
    return $res->status(200)->json($funcionario);
  } catch (Exception $e) {
    return $res->status(401)->json(['erro' => $e->getMessage()]);
  }
});

// GET /api/clientes: Retorna todos os clientes cadastrados no sistema
$app->get("/clientes", function ($req, $res) use ($pdo) {

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
$app->get("/clientes/:filtro", function ($req, $res) use ($pdo) {
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
$app->get("/funcionarios", function ($req, $res) use ($pdo) {
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
$app->get("/funcionarios/:filtro", function ($req, $res) use ($pdo) {
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
$app->get("/equipamentos", function ($req, $res) use ($pdo) {
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
$app->get("/equipamentos/:filtro", function ($req, $res) use ($pdo) {
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
$app->post("/locacoes", function ($req, $res) use ($pdo) {
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
$app->get("/locacoes", function ($req, $res) use ($pdo) {
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
$app->get("/locacoes/:filtro", function ($req, $res) use ($pdo) {
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

// GET /api/devolucoes/simulacao/:locacaoId - Simula o valor a ser pago na devolução (sem gravar no banco)
$app->get("/devolucoes/simulacao/:locacaoId", function ($req, $res) use ($pdo) {
  $params = $req->params();
  $locacaoId = $params['locacaoId'] ?? null;

  if (!$locacaoId) {
    $res->status(400)->json(["erro" => "ID da locação não informado"]);
    return;
  }

  try {
    $gestorLocacao = new GestorLocacao(
      new RepositorioLocacaoEmBDR($pdo)
    );
    $locacao = $gestorLocacao->obterPorId($locacaoId);

    if (!$locacao) {
      $res->status(404)->json(["erro" => "Locação não encontrada"]);
      return;
    }

    $gestor = new GestorDevolucao(
      new RepositorioDevolucaoEmBDR($pdo),
      new RepositorioLocacaoEmBDR($pdo)
    );

    $dadosDevolucao = [
      'locacaoId' => $locacaoId,
      'dataHoraDevolucao' => date('Y-m-d H:i:s')
    ];

    $saida = $gestor->calcularValorPagamento($dadosDevolucao);
    $res->json($saida);
  } catch (Exception $e) {
    $mensagem = $e->getMessage();
    $status = 400;

    if (strpos($mensagem, "já foi devolvida") !== false) {
      $status = 409; // Conflict
    }

    $res->status($status)->json(["erro" => $mensagem]);
  }
});

// POST /api/devolucoes - Registra uma devolução
$app->post("/devolucoes", function ($req, $res) use ($pdo) {
  $dadosDevolucao = (array) $req->body();

  try {
    $gestor = new GestorDevolucao(
      new RepositorioDevolucaoEmBDR($pdo),
      new RepositorioLocacaoEmBDR($pdo)
    );
    $saida = $gestor->registrarDevolucao($dadosDevolucao);
    $res->status(201)->json($saida);
  } catch (Exception $e) {
    $mensagem = $e->getMessage();
    $status = 400;

    if (strpos($mensagem, "já foi devolvida") !== false) {
      $status = 409;
    }

    $res->status($status)->json(["erro" => $mensagem]);
  }
});

// GET /api/devolucoes - Retorna todas as devoluções cadastradas no sistema
$app->get("/devolucoes", function ($req, $res) use ($pdo) {
  try {
    $gestor = new GestorDevolucao(
      new RepositorioDevolucaoEmBDR($pdo),
      new RepositorioLocacaoEmBDR($pdo)
    );
    $saida = $gestor->obterDevolucoes(null);
    $res->json($saida);
  } catch (Exception $e) {
    $res->status(500)->json(["erro" => $e->getMessage()]);
  }
});

$app->listen(['rootURL' => API_PREFIX]);


// POST /api/registrarAvaria/:id: Adiciona uma avaria ao equipamento
$app->post("/registrarAvaria/:id", function ($req, $res) use ($pdo) {
  $params = $req->params();
  $id = (int) ($params['id'] ?? 0);

  $body = $req->body();
  $novaAvaria = $body['avaria'] ?? '';

  try {
    $gestor = new GestorEquipamento(
      new RepositorioEquipamentoEmBDR($pdo)
    );

    $gestor->registrarAvaria($id, $novaAvaria);

    return $res->json(["mensagem" => "Avaria registrada com sucesso."]);
  } catch (InvalidArgumentException $e) {
    return $res->status(400)->json(["erro" => $e->getMessage()]);
  } catch (ErroAtualizacaoEquipamentoException $e) {
    return $res->status(500)->json(["erro" => "Erro ao atualizar o equipamento."]);
  } catch (Exception $e) {
    return $res->status(500)->json(["erro" => "Erro não esperado ao atualizar equipamento: " . $e->getMessage()]);
  }
});
