<?php

describe("GestorDevolucao", function () {
  beforeEach(function () {
    $this->pdo = conectarPDO();
    $this->pdo->exec(file_get_contents('db/test_script.sql'));
    $this->devolucaoRepo = new RepositorioDevolucaoEmBDR($this->pdo);
    $this->locacaoRepo = new RepositorioLocacaoEmBDR($this->pdo);
    
    $this->clienteId = 1;
    $this->funcionarioId = 1;
    $this->equipamentoId = 1;
    
    $this->pdo->exec("DELETE FROM devolucao WHERE 1=1");
    
    $this->pdo->exec("
      INSERT INTO locacao 
      (data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, 
      desconto, valor_total, cliente_id, funcionario_id)
      VALUES 
      (NOW(), 2, DATE_ADD(NOW(), INTERVAL 2 HOUR), 0, 30.00, {$this->clienteId}, {$this->funcionarioId})
    ");
    
    $this->locacaoId = $this->pdo->lastInsertId();
    
    $this->pdo->exec("
      INSERT INTO item_locado
      (tempo_contratado, subtotal, equipamento_id, locacao_id)
      VALUES
      (2, 30.00, {$this->equipamentoId}, {$this->locacaoId})
    ");
    
    $this->pdo->exec("
      INSERT INTO locacao 
      (data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, 
      desconto, valor_total, cliente_id, funcionario_id)
      VALUES 
      (NOW(), 2, DATE_ADD(NOW(), INTERVAL 2 HOUR), 0, 40.00, {$this->clienteId}, {$this->funcionarioId})
    ");
    
    $this->locacaoComDevolucaoId = $this->pdo->lastInsertId();
    
    $this->pdo->exec("
      INSERT INTO item_locado
      (tempo_contratado, subtotal, equipamento_id, locacao_id)
      VALUES
      (2, 40.00, {$this->equipamentoId}, {$this->locacaoComDevolucaoId})
    ");
    
    $this->pdo->exec("
      INSERT INTO devolucao
      (data_hora_devolucao, valor_pago, locacao_id, funcionario_id)
      VALUES
      (NOW(), 40.00, {$this->locacaoComDevolucaoId}, {$this->funcionarioId})
    ");
  });

  describe("GET /devolucoes/simulacao/:locacaoId", function () {
    it("Deve calcular corretamente o valor a ser pago na devolução", function () {
      $this->pdo->exec("DELETE FROM devolucao WHERE 1=1");
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      $dadosDevolucao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => date('Y-m-d H:i:s')
      ];
      
      $resultado = $gestor->calcularValorPagamento($dadosDevolucao);
      
      expect($resultado)->not->toBe(null);
      expect($resultado)->toBeAn('array');
      expect($resultado)->toContainKey('locacao');
      expect($resultado)->toContainKey('dataHoraDevolucao');
      expect($resultado)->toContainKey('valorPago');
      expect($resultado['locacao']['codigo'])->toEqual($this->locacaoId);
      expect($resultado['valorPago'])->toBeGreaterThan(0);
    });
      
    it("Deve lançar uma exceção quando tentar simular para uma locação que já foi devolvida", function () {
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      $dadosDevolucao = [
        'locacaoId' => $this->locacaoComDevolucaoId,
        'dataHoraDevolucao' => date('Y-m-d H:i:s')
      ];
      
      $exception = null;
      try {
        $gestor->calcularValorPagamento($dadosDevolucao);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('já foi devolvida');
    });
      
    it("Deve lançar uma exceção quando a locação não existir", function () {
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      $dadosDevolucao = [
        'locacaoId' => 9999,
        'dataHoraDevolucao' => date('Y-m-d H:i:s')
      ];
      
      $exception = null;
      try {
        $gestor->calcularValorPagamento($dadosDevolucao);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('não encontrada');
    });
  });
  
  describe("POST /devolucoes", function () {
    it("Deve registrar corretamente uma devolução", function () {
      $this->pdo->exec("DELETE FROM devolucao WHERE 1=1");
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);

      $simulacao = $gestor->calcularValorPagamento([
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => date('Y-m-d H:i:s')
      ]);

      $dadosDevolucao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => $simulacao['dataHoraDevolucao'],
        'registradoPor' => [
          'codigo' => $this->funcionarioId
        ],
        'valorPago' => $simulacao['valorPago']
      ];
      
      $resultado = $gestor->registrarDevolucao($dadosDevolucao);
      
      expect($resultado)->not->toBe(null);
      expect($resultado)->toBeAn('array');
      expect($resultado)->toContainKey('codigo');
      expect($resultado)->toContainKey('dataHoraDevolucao');
      expect($resultado)->toContainKey('valorPago');
      expect($resultado)->toContainKey('locacao');
      expect($resultado)->toContainKey('registradoPor');
      expect($resultado['locacao']['codigo'])->toEqual($this->locacaoId);
      expect($resultado['registradoPor']['codigo'])->toEqual($this->funcionarioId);
    });
      
    it("Deve lançar uma exceção quando tentar registrar uma devolução sem locação", function () {
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      $dadosDevolucao = [
        'dataHoraDevolucao' => date('Y-m-d H:i:s'),
        'registradoPor' => [
          'codigo' => $this->funcionarioId
        ]
      ];
      
      $exception = null;
      try {
        $gestor->registrarDevolucao($dadosDevolucao);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('não informada');
    });
      
    it("Deve lançar uma exceção quando tentar registrar uma devolução sem funcionário", function () {
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      $dadosDevolucao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => date('Y-m-d H:i:s')
      ];
      
      $exception = null;
      try {
        $gestor->registrarDevolucao($dadosDevolucao);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('não informado');
    });
      
    it("Deve lançar uma exceção quando tentar registrar uma devolução para uma locação já devolvida", function () {
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);

      $simulacao = $gestor->calcularValorPagamento([
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => date('Y-m-d H:i:s')
      ]);

      $dadosDevolucao = [
        'locacaoId' => $this->locacaoComDevolucaoId,
        'dataHoraDevolucao' => $simulacao['dataHoraDevolucao'],
        'registradoPor' => [
          'codigo' => $this->funcionarioId
        ],
        'valorPago' => $simulacao['valorPago']
      ];
      
      $exception = null;
      try {
        $gestor->registrarDevolucao($dadosDevolucao);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('já foi devolvida');
    });

    it("Deve lançar uma exceção quando valorPago não for informado", function () {
      $this->pdo->exec("DELETE FROM devolucao WHERE 1=1");
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);

      $dadosDevolucao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => date('Y-m-d H:i:s'),
        'registradoPor' => [
          'codigo' => $this->funcionarioId
        ]
      ];
      
      $exception = null;
      try {
        $gestor->registrarDevolucao($dadosDevolucao);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('obrigatório');
      expect($exception->getMessage())->toContain('Valor');
    });

    it("Deve lançar uma exceção quando valorPago for uma string vazia", function () {
      $this->pdo->exec("DELETE FROM devolucao WHERE 1=1");
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);

      $dadosDevolucao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => date('Y-m-d H:i:s'),
        'valorPago' => '',
        'registradoPor' => [
          'codigo' => $this->funcionarioId
        ]
      ];
      
      $exception = null;
      try {
        $gestor->registrarDevolucao($dadosDevolucao);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('obrigatório');
      expect($exception->getMessage())->toContain('string vazia');
    });

    it("Deve lançar uma exceção quando valorPago for diferente do valor calculado", function () {
      $this->pdo->exec("DELETE FROM devolucao WHERE 1=1");
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      
      $dadosSimulacao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => date('Y-m-d H:i:s')
      ];

      $simulacao = $gestor->calcularValorPagamento($dadosSimulacao);
      
      $dadosDevolucao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => $simulacao['dataHoraDevolucao'],
        'valorPago' => $simulacao['valorPago'] + 1,
        'registradoPor' => [
          'codigo' => $this->funcionarioId
        ]
      ];
      
      $exception = null;
      try {
        $gestor->registrarDevolucao($dadosDevolucao);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('não está correto');
      expect($exception->getMessage())->toContain('Valor esperado');
      expect($exception->getMessage())->toContain('Tente novamente');
    });

    it("Deve registrar devolução com sucesso quando valorPago for igual ao valor calculado", function () {
      $this->pdo->exec("DELETE FROM devolucao WHERE 1=1");
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);

      $dadosSimulacao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => date('Y-m-d H:i:s')
      ];
      $simulacao = $gestor->calcularValorPagamento($dadosSimulacao);
      
      $dadosDevolucao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => $simulacao['dataHoraDevolucao'],
        'valorPago' => $simulacao['valorPago'],
        'registradoPor' => [
          'codigo' => $this->funcionarioId
        ]
      ];
      
      $resultado = $gestor->registrarDevolucao($dadosDevolucao);
      
      expect($resultado)->not->toBe(null);
      expect($resultado)->toBeAn('array');
      expect($resultado)->toContainKey('codigo');
      expect($resultado)->toContainKey('valorPago');
      expect($resultado['locacao']['codigo'])->toEqual($this->locacaoId);
      expect(floatval($resultado['valorPago']))->toEqual($simulacao['valorPago']);
    });

    it("Deve usar o valor calculado no banco mesmo quando valor informado for um pouquinho diferente por causa do arredondamento", function () {
      $this->pdo->exec("DELETE FROM devolucao WHERE 1=1");
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      
      $dadosSimulacao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => date('Y-m-d H:i:s')
      ];
      $simulacao = $gestor->calcularValorPagamento($dadosSimulacao);
      
      $dadosDevolucao = [
        'locacaoId' => $this->locacaoId,
        'dataHoraDevolucao' => $simulacao['dataHoraDevolucao'],
        'valorPago' => $simulacao['valorPago'] + 0.005,
        'registradoPor' => [
          'codigo' => $this->funcionarioId
        ]
      ];
      
      $resultado = $gestor->registrarDevolucao($dadosDevolucao);
      
      expect($resultado)->not->toBe(null);
      expect($resultado)->toBeAn('array');
      expect(floatval($resultado['valorPago']))->toEqual($simulacao['valorPago']);
    });
  });
  
  describe("GET /devolucoes", function () {
    it("Deve retornar todas as devoluções quando nenhum filtro é passado", function () {
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      $devolucoes = $gestor->obterDevolucoes(null);
      
      expect($devolucoes)->not->toBe(null);
      expect($devolucoes)->toBeAn('array');
      expect(count($devolucoes))->toBeGreaterThan(0);
      
      expect($devolucoes[0])->toBeAn('array');
      expect($devolucoes[0])->toContainKey('codigo');
      expect($devolucoes[0])->toContainKey('dataHoraDevolucao');
      expect($devolucoes[0])->toContainKey('valorPago');
      expect($devolucoes[0])->toContainKey('locacao');
      expect($devolucoes[0])->toContainKey('registradoPor');
    });
      
      // it("Deve filtrar devoluções por código de locação", function () {
      //     $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      //     $devolucoes = $gestor->obterDevolucoes($this->locacaoComDevolucaoId);
          
      //     expect($devolucoes)->not->toBe(null);
      //     expect($devolucoes)->toBeAn('array');
      //     expect(count($devolucoes))->toBe(1);
      //     expect($devolucoes[0]['locacao']['codigo'])->toEqual($this->locacaoComDevolucaoId);
      // });
      
      // it("Deve retornar array vazio quando não encontrar devoluções pelo filtro", function () {
      //     $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      //     $devolucoes = $gestor->obterDevolucoes(9999);
          
      //     expect($devolucoes)->toBeAn('array');
      //     expect($devolucoes)->toBeEmpty();
      // });
  });
  
  describe("Problema de várias locações do mesmo cliente", function () {
    it("Deve impedir devolução da mesma locação duas vezes", function () {
      $this->pdo->exec("
        INSERT INTO locacao 
        (id, data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, 
        desconto, valor_total, cliente_id, funcionario_id)
        VALUES 
        (5, NOW(), 2, DATE_ADD(NOW(), INTERVAL 2 HOUR), 0, 30.00, {$this->clienteId}, {$this->funcionarioId})
      ");
      
      $this->pdo->exec("
        INSERT INTO item_locado
        (tempo_contratado, subtotal, equipamento_id, locacao_id)
        VALUES
        (2, 30.00, {$this->equipamentoId}, 5)
      ");
      
      $this->pdo->exec("
        INSERT INTO devolucao
        (data_hora_devolucao, valor_pago, locacao_id, funcionario_id)
        VALUES
        (NOW(), 30.00, 5, {$this->funcionarioId})
      ");
      
      $gestor = new GestorDevolucao($this->devolucaoRepo, $this->locacaoRepo);
      
      $dadosDevolucao = [
        'locacaoId' => 5,
        'dataHoraDevolucao' => date('Y-m-d H:i:s'),
        'registradoPor' => [
          'codigo' => $this->funcionarioId
        ],
        'valorPago' => 30.00
      ];
      
      $exception = null;
      try {
        $gestor->registrarDevolucao($dadosDevolucao);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('já foi devolvida');
    });
  });
});