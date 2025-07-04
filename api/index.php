<?php
require_once 'vendor/autoload.php';

use \phputil\router\Router;
use function \phputil\cors\cors;

define('API_PREFIX', '/api');

$app = new Router();

$app->use(cors([
  'origin' => ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8000'],
  'allowedHeaders' => ['Host', 'Origin', 'Accept', 'Content-Type', 'Content-Length', 'Cookie'],
  'exposeHeaders' => ['Content-Type', 'Content-Length', 'Set-Cookie'],
  'credentials' => true
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
    
    return $res->status(200)->json([
      'sucesso' => true,
      'funcionario' => $funcionario,
      'mensagem' => 'Login realizado com sucesso.'
    ]);
  } catch (ErroLoginException $e) {
    return $res->status(401)->json([
      'sucesso' => false,
      'erro' => $e->getMessage()
    ]);
  }
});

// POST /api/logout: Realiza o logout do sistema
$app->post("/logout", function ($req, $res) use ($pdo) {
  try {
    $gestor = new GestorFuncionario(new RepositorioFuncionarioEmBDR($pdo));
    $resultado = $gestor->logout();
    
    return $res->status(200)->json([
      'sucesso' => true,
      'mensagem' => $resultado['mensagem']
    ]);
  } catch (ErroLogoutException $e) {
    return $res->status(500)->json([
      'sucesso' => false,
      'erro' => $e->getMessage()
    ]);
  }
});

// GET /api/auth/me: Verifica se o usuário está autenticado
$app->get("/auth/me", function ($req, $res) use ($pdo) {
  try {
    $gestor = new GestorFuncionario(new RepositorioFuncionarioEmBDR($pdo));
    $funcionario = $gestor->verificarAutenticacao();
    
    if (!$funcionario) {
      return $res->status(401)->json([
        'sucesso' => false,
        'autenticado' => false,
        'erro' => 'Usuário não autenticado ou sessão expirada.'
      ]);
    }
    
    return $res->status(200)->json([
      'sucesso' => true,
      'autenticado' => true,
      'funcionario' => $funcionario
    ]);
  } catch (AuthException $e) {
    return $res->status(500)->json([
      'sucesso' => false,
      'autenticado' => false,
      'erro' => $e->getMessage()
    ]);
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
  } catch (ClienteException $e) {
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
  } catch (ClienteException $e) {
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
  } catch (FuncionarioException $e) {
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
  } catch (FuncionarioException $e) {
    $res->status(500)->json([$e->getMessage()]);
  }
});

// GET /api/equipamentos: Retorna todos os equipamentos
$app->get("/equipamentos", function ($req, $res) use ($pdo) {
  try {
    $gestor = new GestorEquipamento(
      new RepositorioEquipamentoEmBDR($pdo),
      new RepositorioAvariaEmBDR($pdo)
    );
    $saida = $gestor->obterEquipamentos(null);
    $res->json($saida);
  } catch (EquipamentosException $e) {
    $res->status(500)->json([$e->getMessage()]);
  }
});

// GET /api/equipamentos/:filtro: Busca equipamentos por critério específico
$app->get("/equipamentos/:filtro", function ($req, $res) use ($pdo) {
  $params = $req->params();
  $filtro = $params['filtro'] ?? null;

  try {
    $gestor = new GestorEquipamento(
      new RepositorioEquipamentoEmBDR($pdo),
      new RepositorioAvariaEmBDR($pdo)
    );
    $saida = $gestor->obterEquipamentos($filtro);
    $res->json($saida);
  } catch (EquipamentosException $e) {
    $res->status(500)->json([$e->getMessage()]);
  }
});

// POST /api/locacoes: Registra uma nova locação (apenas Atendente ou Gerente)
$app->post("/locacoes", function ($req, $res) use ($pdo) {
  $middlewareResponse = AuthMiddleware::verificarAtendente($req, $res, function($req, $res) use ($pdo) {
    $dadosLocacao = (array) $req->body();

    try {
      $gestor = new GestorLocacao(
        new RepositorioLocacaoEmBDR($pdo)
      );
      $saida = $gestor->registrarLocacao($dadosLocacao);
      return $res->status(201)->json($saida);
    } catch (LocacaoException $e) {
      return $res->status(400)->json(["erro" => $e->getMessage()]);
    }
  });
  
  return $middlewareResponse;
});

// GET /api/locacoes: Retorna todas as locações cadastradas no sistema
$app->get("/locacoes", function ($req, $res) use ($pdo) {
  try {
    $gestor = new GestorLocacao(
      new RepositorioLocacaoEmBDR($pdo)
    );
    $saida = $gestor->obterLocacoes(null);
    $res->json($saida);
  } catch (LocacaoException $e) {
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
  } catch (LocacaoException $e) {
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
      new RepositorioLocacaoEmBDR($pdo),
      new RepositorioAvariaEmBDR($pdo)
    );

    $dadosDevolucao = [
      'locacaoId' => $locacaoId,
      'dataHoraDevolucao' => date('Y-m-d H:i:s')
    ];

    $saida = $gestor->simularDevolucao($dadosDevolucao);
    $res->json($saida);
  } catch (DevolucaoException $e) {
    $mensagem = $e->getMessage();
    $status = 400;

    if (strpos($mensagem, "já foi devolvida") !== false) {
      $status = 409; // Conflict
    }

    $res->status($status)->json(["erro" => $mensagem]);
  }
});

// POST /api/devolucoes - Registra uma devolução (apenas Atendente ou Gerente)
$app->post("/devolucoes", function ($req, $res) use ($pdo) {
  $middlewareResponse = AuthMiddleware::verificarAtendente($req, $res, function($req, $res) use ($pdo) {
    $dadosDevolucao = (array) $req->body();

    try {
      $gestor = new GestorDevolucao(
        new RepositorioDevolucaoEmBDR($pdo),
        new RepositorioLocacaoEmBDR($pdo),
        new RepositorioAvariaEmBDR($pdo)
      );
      $saida = $gestor->registrarDevolucao($dadosDevolucao);
      return $res->status(201)->json($saida);
    } catch (DevolucaoException $e) {
      $mensagem = $e->getMessage();
      $status = 400;

      if (strpos($mensagem, "já foi devolvida") !== false) {
        $status = 409;
      }

      return $res->status($status)->json(["erro" => $mensagem]);
    }
  });
  
  return $middlewareResponse;
});

// GET /api/devolucoes - Retorna todas as devoluções cadastradas no sistema
$app->get("/devolucoes", function ($req, $res) use ($pdo) {
  try {
    $gestor = new GestorDevolucao(
      new RepositorioDevolucaoEmBDR($pdo),
      new RepositorioLocacaoEmBDR($pdo),
      new RepositorioAvariaEmBDR($pdo)
    );
    $saida = $gestor->obterDevolucoes(null);
    $res->json($saida);
  } catch (DevolucaoException $e) {
    $res->status(500)->json(["erro" => $e->getMessage()]);
  }
});

// POST /api/avarias - Registra uma nova avaria (apenas Gerente)
$app->post("/avarias", function ($req, $res) use ($pdo) {
  $middlewareResponse = AuthMiddleware::verificarGerente($req, $res, function($req, $res) use ($pdo) {
    try {
      $dadosAvaria = [];

      $dadosAvaria['avaliadorId'] = (int) ($_POST['avaliadorId'] ?? 0);
      $dadosAvaria['descricao'] = $_POST['descricao'] ?? '';
      $dadosAvaria['valorCobrar'] = floatval($_POST['valorCobrar'] ?? 0);
      $dadosAvaria['equipamentoId'] = (int) ($_POST['equipamentoId'] ?? 0);
      $dadosAvaria['locacaoId'] = (int) ($_POST['locacaoId'] ?? 0);
      $dadosAvaria['foto'] = $_FILES['foto'] ?? null;

      $gestor = new GestorAvaria(
        new RepositorioAvariaEmBDR($pdo),
        new RepositorioEquipamentoEmBDR($pdo),
        new RepositorioLocacaoEmBDR($pdo)
      );
      
      $avaria = $gestor->registrarAvaria($dadosAvaria);
      return $res->status(201)->json([
        'sucesso' => true,
        'avaria' => $avaria,
        'mensagem' => 'Avaria registrada com sucesso.'
      ]);
    } catch (AvariaException $e) {
      return $res->status(400)->json([
        'sucesso' => false,
        'erro' => $e->getMessage()
      ]);
    }
  });
  
  return $middlewareResponse;
});

// GET /api/avarias/equipamento/:equipamentoId - Obtém avarias de um equipamento
$app->get("/avarias/equipamento/:equipamentoId", function ($req, $res) use ($pdo) {
  $params = $req->params();
  $equipamentoId = (int) ($params['equipamentoId'] ?? 0);

  if (!$equipamentoId) {
    return $res->status(400)->json(['erro' => 'ID do equipamento é obrigatório']);
  }

  try {
    $gestor = new GestorAvaria(
      new RepositorioAvariaEmBDR($pdo),
      new RepositorioEquipamentoEmBDR($pdo),
      new RepositorioLocacaoEmBDR($pdo)
    );
    
    $avarias = $gestor->obterAvariasPorEquipamento($equipamentoId);
    return $res->json([
      'sucesso' => true,
      'avarias' => $avarias
    ]);
  } catch (AvariaException $e) {
    return $res->status(500)->json([
      'sucesso' => false,
      'erro' => $e->getMessage()
    ]);
  }
});

// GET /api/avarias/locacao/:locacaoId - Obtém avarias de uma locação
$app->get("/avarias/locacao/:locacaoId", function ($req, $res) use ($pdo) {
  $params = $req->params();
  $locacaoId = (int) ($params['locacaoId'] ?? 0);

  if (!$locacaoId) {
    return $res->status(400)->json(['erro' => 'ID da locação é obrigatório']);
  }

  try {
    $gestor = new GestorAvaria(
      new RepositorioAvariaEmBDR($pdo),
      new RepositorioEquipamentoEmBDR($pdo),
      new RepositorioLocacaoEmBDR($pdo)
    );
    
    $avarias = $gestor->obterAvariasPorLocacao($locacaoId);
    return $res->json([
      'sucesso' => true,
      'avarias' => $avarias
    ]);
  } catch (AvariaException $e) {
    return $res->status(500)->json([
      'sucesso' => false,
      'erro' => $e->getMessage()
    ]);
  }
});

// DELETE /api/avarias/:id - Remove uma avaria (apenas Atendente ou Gerente)
$app->delete("/avarias/:id", function ($req, $res) use ($pdo) {
  $middlewareResponse = AuthMiddleware::verificarAtendente($req, $res, function($req, $res) use ($pdo) {
    $params = $req->params();
    $id = $params['id'] ?? '';

    if (!$id) {
      return $res->status(400)->json(['erro' => 'ID da avaria é obrigatório']);
    }

    try {
      $gestor = new GestorAvaria(
        new RepositorioAvariaEmBDR($pdo),
        new RepositorioEquipamentoEmBDR($pdo),
        new RepositorioLocacaoEmBDR($pdo)
      );
      
      $removida = $gestor->removerAvaria($id);
      
      if ($removida) {
        return $res->json([
          'sucesso' => true,
          'mensagem' => 'Avaria removida com sucesso.'
        ]);
      } else {
        return $res->status(404)->json([
          'sucesso' => false,
          'erro' => 'Avaria não encontrada.'
        ]);
      }
    } catch (AvariaException $e) {
      return $res->status(400)->json([
        'sucesso' => false,
        'erro' => $e->getMessage()
      ]);
    }
  });
  
  return $middlewareResponse;
});

// GET /api/avarias/foto/:id - foto de uma avaria
$app->get("/avarias/foto/:id", function ($req, $res) use ($pdo) {
  $params = $req->params();
  $id = $params['id'] ?? '';

  if (!$id) {
    return $res->status(400)->json(['erro' => 'ID da avaria é obrigatório']);
  }

  try {
    $gestor = new GestorAvaria(
      new RepositorioAvariaEmBDR($pdo),
      new RepositorioEquipamentoEmBDR($pdo),
      new RepositorioLocacaoEmBDR($pdo)
    );
    
    $avaria = $gestor->obterAvariaPorId($id);
    
    if (!$avaria) {
      return $res->status(404)->json(['erro' => 'Avaria não encontrada']);
    }
    
    $caminhoArquivo = __DIR__ . '/' . $avaria['fotoCaminho'];
    
    if (!file_exists($caminhoArquivo)) {
      return $res->status(404)->json(['erro' => 'Arquivo de foto não encontrado']);
    }
    
    $res->header('Content-Type', 'image/jpeg');
    $res->header('Content-Length', filesize($caminhoArquivo));
    
    readfile($caminhoArquivo);
    
  } catch (AvariaException $e) {
    return $res->status(500)->json(['erro' => $e->getMessage()]);
  }
});

// GET /api/relatorios/locacoes-devolvidas
// Relatório de locações devolvidas por período (apenas Gerentes)
// Gera dados para gráfico de colunas mostrando valores totais pagos nas devoluções agrupados por data de locação.
// Exemplo de Requisição: /api/relatorios/locacoes-devolvidas?dataInicial=2024-01-01&dataFinal=2024-01-31
// Se não informado, usa o primeiro e último dia do mês atual.
$app->get("/relatorios/locacoes-devolvidas", function ($req, $res) use ($pdo) {
  $middlewareResponse = AuthMiddleware::verificarGerente($req, $res, function($req, $res) use ($pdo) {
    $dataInicial = $req->param('dataInicial');
    $dataFinal = $req->param('dataFinal');

    try {
      $gestor = new GestorRelatorio(
        new RepositorioRelatorioEmBDR($pdo)
      );
      $relatorio = $gestor->gerarRelatorioLocacoesDevolvidasPorPeriodo($dataInicial, $dataFinal);
      return $res->json([
        'sucesso' => true,
        'relatorio' => $relatorio
      ]);
    } catch (RelatorioException $e) {
      return $res->status(400)->json([
        'sucesso' => false,
        'erro' => $e->getMessage()
      ]);
    }
  });
  
  return $middlewareResponse;
});

// GET /api/relatorios/top-10-itens
// Relatório de top 10 itens mais alugados (Gerentes e Atendentes)
// Gera dados para gráfico de pizza e tabela de ranking dos equipamentos mais alugados.
// Exemplo de Requisição: /api/relatorios/top-10-itens?dataInicial=2024-01-01&dataFinal=2024-01-31
// Se não informado, usa o primeiro e último dia do mês atual.
$app->get("/relatorios/top-10-itens", function ($req, $res) use ($pdo) {
  $middlewareResponse = AuthMiddleware::verificarAtendente($req, $res, function($req, $res) use ($pdo) {
    $dataInicial = $req->param('dataInicial');
    $dataFinal = $req->param('dataFinal');

    try {
      $gestor = new GestorRelatorio(
        new RepositorioRelatorioEmBDR($pdo)
      );
      $relatorio = $gestor->gerarRelatorioTop10ItensMaisAlugados($dataInicial, $dataFinal);
      return $res->json([
        'sucesso' => true,
        'relatorio' => $relatorio
      ]);
    } catch (RelatorioException $e) {
      return $res->status(400)->json([
        'sucesso' => false,
        'erro' => $e->getMessage()
      ]);
    }
  });
  
  return $middlewareResponse;
});

$app->listen(['rootURL' => API_PREFIX]);