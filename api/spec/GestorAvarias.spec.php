<?php

describe("GestorAvaria", function () {
  beforeEach(function () {
    $this->pdo = conectarPDO();
    $this->pdo->exec(file_get_contents('db/test_script.sql'));
    $this->avariaRepo = new RepositorioAvariaEmBDR($this->pdo);
    $this->equipamentoRepo = new RepositorioEquipamentoEmBDR($this->pdo);
    
    $this->clienteId = 1;
    $this->funcionarioId = 1;
    $this->equipamentoId = 1;
    
    $this->pdo->exec("DELETE FROM avaria WHERE 1=1");
    $this->pdo->exec("DELETE FROM devolucao WHERE 1=1");
    
    $this->pdo->exec("
      INSERT INTO locacao 
      (data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, 
      desconto, valor_total, cliente_id, funcionario_id)
      VALUES 
      (NOW(), 2, DATE_ADD(NOW(), INTERVAL 2 HOUR), 0, 30.00, {$this->clienteId}, {$this->funcionarioId})
    ");
    
    $this->locacaoId = $this->pdo->lastInsertId();
    
  });

  describe("Validações", function () {
    it("Deve lançar exceção quando avaliador não é informado", function () {
      $gestor = new GestorAvaria($this->avariaRepo, $this->equipamentoRepo, null);
      
      $dadosAvaria = [
        'descricao' => 'Teste de avaria',
        'valorCobrar' => 50.00,
        'equipamentoId' => $this->equipamentoId,
        'locacaoId' => $this->locacaoId,
        'foto' => ['name' => 'test.jpg', 'tmp_name' => '/tmp/test', 'type' => 'image/jpeg', 'size' => 1024]
      ];
      
      $exception = null;
      try {
        $gestor->registrarAvaria($dadosAvaria);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('Avaliador é obrigatório');
    });
    
    it("Deve lançar exceção quando descrição não é informada", function () {
      $gestor = new GestorAvaria($this->avariaRepo, $this->equipamentoRepo, null);
      
      $dadosAvaria = [
        'avaliadorId' => $this->funcionarioId,
        'valorCobrar' => 50.00,
        'equipamentoId' => $this->equipamentoId,
        'locacaoId' => $this->locacaoId,
        'foto' => ['name' => 'test.jpg', 'tmp_name' => '/tmp/test', 'type' => 'image/jpeg', 'size' => 1024]
      ];
      
      $exception = null;
      try {
        $gestor->registrarAvaria($dadosAvaria);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('Descrição da avaria é obrigatória');
    });
    
    it("Deve lançar exceção quando valor é negativo", function () {
      $gestor = new GestorAvaria($this->avariaRepo, $this->equipamentoRepo, null);
      
      $dadosAvaria = [
        'avaliadorId' => $this->funcionarioId,
        'descricao' => 'Teste de avaria',
        'valorCobrar' => -10.00,
        'equipamentoId' => $this->equipamentoId,
        'locacaoId' => $this->locacaoId,
        'foto' => ['name' => 'test.jpg', 'tmp_name' => '/tmp/test', 'type' => 'image/jpeg', 'size' => 1024]
      ];
      
      $exception = null;
      try {
        $gestor->registrarAvaria($dadosAvaria);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('deve ser maior ou igual a zero');
    });
    
    it("Deve lançar exceção quando equipamento não existe", function () {
      $gestor = new GestorAvaria($this->avariaRepo, $this->equipamentoRepo, null);
      
      $dadosAvaria = [
        'avaliadorId' => $this->funcionarioId,
        'descricao' => 'Teste de avaria',
        'valorCobrar' => 50.00,
        'equipamentoId' => 9999,
        'locacaoId' => $this->locacaoId,
        'foto' => ['name' => 'test.jpg', 'tmp_name' => '/tmp/test', 'type' => 'image/jpeg', 'size' => 1024]
      ];
      
      $exception = null;
      try {
        $gestor->registrarAvaria($dadosAvaria);
      } catch (Exception $e) {
        $exception = $e;
      }
      
      expect($exception)->not->toBe(null);
      expect($exception->getMessage())->toContain('Equipamento não encontrado');
    });
  });

  describe("Consultas", function () {
    it("Deve retornar array vazio quando não há avarias para equipamento", function () {
      $gestor = new GestorAvaria($this->avariaRepo, $this->equipamentoRepo, null);
      
      $avarias = $gestor->obterAvariasPorEquipamento($this->equipamentoId);
      
      expect($avarias)->toBeA('array');
      expect(count($avarias))->toEqual(0);
    });
    
    it("Deve retornar array vazio quando não há avarias para locação", function () {
      $gestor = new GestorAvaria($this->avariaRepo, $this->equipamentoRepo, null);
      
      $avarias = $gestor->obterAvariasPorLocacao($this->locacaoId);
      
      expect($avarias)->toBeA('array');
      expect(count($avarias))->toEqual(0);
    });
    
    it("Deve retornar null quando avaria não existe", function () {
      $gestor = new GestorAvaria($this->avariaRepo, $this->equipamentoRepo, null);
      
      $avaria = $gestor->obterAvariaPorId('inexistente-uuid');
      
      expect($avaria)->toBe(null);
    });
  });
}); 