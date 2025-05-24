<?php

class RepositorioDevolucaoEmBDR implements RepositorioDevolucao {

    public function __construct(
        private PDO $pdo
    ) {}

    public function salvar(Devolucao $devolucao) {
        try {
            $this->pdo->beginTransaction();
            
            $stmt = $this->pdo->prepare('
                INSERT INTO devolucao 
                (data_hora_devolucao, valor_pago, locacao_id, funcionario_id) 
                VALUES (?, ?, ?, ?)
            ');
            
            $stmt->execute([
                $devolucao->getDataHoraDevolucao(),
                $devolucao->getValorPago(),
                $devolucao->getLocacao()['codigo'],
                $devolucao->getRegistradoPor()['codigo']
            ]);
            
            $codigoDevolucao = $this->pdo->lastInsertId();
            
            // seta os equipamentos para disponível = true
            $stmtEquip = $this->pdo->prepare('
                UPDATE equipamento e
                JOIN item_locado i ON e.id = i.equipamento_id
                SET e.disponivel = 1
                WHERE i.locacao_id = ?
            ');
            
            $stmtEquip->execute([$devolucao->getLocacao()['codigo']]);
            
            $this->pdo->commit();
            
            return $this->obterPorId((int)$codigoDevolucao);
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
    
    public function obterPorId($codigo) {
        $query = '
            SELECT d.*, 
                l.id as locacao_id, l.data_hora_locacao, l.cliente_id,
                c.nome_completo as cliente_nome, c.cpf as cliente_cpf,
                f.id as funcionario_id, f.nome as funcionario_nome
            FROM devolucao d
            INNER JOIN locacao l ON d.locacao_id = l.id
            INNER JOIN cliente c ON l.cliente_id = c.id
            INNER JOIN funcionario f ON d.funcionario_id = f.id
            WHERE d.id = ?
        ';
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$codigo]);
        $devolucaoData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$devolucaoData) {
            return null;
        }
        
        $stmtLocacao = $this->pdo->prepare('
            SELECT l.*
            FROM locacao l
            WHERE l.id = ?
        ');
        
        $stmtLocacao->execute([$devolucaoData['locacao_id']]);
        $locacaoData = $stmtLocacao->fetch(PDO::FETCH_ASSOC);
        
        $locacao = [
            'codigo' => $locacaoData['id'],
            'dataHoraLocacao' => $locacaoData['data_hora_locacao'],
            'horasContratadas' => $locacaoData['horas_contratadas'],
            'dataHoraEntregaPrevista' => $locacaoData['data_hora_entrega_prevista'],
            'cliente' => [
                'codigo' => $devolucaoData['cliente_id'],
                'nomeCompleto' => $devolucaoData['cliente_nome'],
                'cpf' => $devolucaoData['cliente_cpf']
            ]
        ];
        
        $funcionario = [
            'codigo' => $devolucaoData['funcionario_id'],
            'nome' => $devolucaoData['funcionario_nome']
        ];
        
        $devolucao = new Devolucao(
            $devolucaoData['id'],
            $devolucaoData['data_hora_devolucao'],
            $devolucaoData['valor_pago'],
            $locacao,
            $funcionario
        );
        
        return $devolucao->toArray();
    }
    
    public function obterTodos($filtro = null, $apenasLocacaoId = false) {
        $sql = '
            SELECT d.*, 
                l.id as locacao_id, l.data_hora_locacao, l.cliente_id,
                c.nome_completo as cliente_nome, c.cpf as cliente_cpf,
                f.id as funcionario_id, f.nome as funcionario_nome
            FROM devolucao d
            INNER JOIN locacao l ON d.locacao_id = l.id
            INNER JOIN cliente c ON l.cliente_id = c.id
            INNER JOIN funcionario f ON d.funcionario_id = f.id
        ';
        
        $params = [];
        
        if ($filtro) {
            if ($apenasLocacaoId) {
                $sql .= ' WHERE d.locacao_id = ?';
                $params = [$filtro];
            }
            else if (strlen($filtro) === 11) {
                $sql .= ' WHERE c.cpf = ?';
                $params = [$filtro];
            } 
            else {
                $sql .= ' WHERE d.locacao_id = ? OR c.id = ? OR d.funcionario_id = ?';
                $params = [$filtro, $filtro, $filtro];
            }
        }
        
        $sql .= ' ORDER BY d.data_hora_devolucao DESC';
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $devolucoesData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $devolucoes = [];
        foreach ($devolucoesData as $devolucaoData) {
            $devolucoes[] = $this->obterPorId($devolucaoData['id']);
        }
        
        return $devolucoes;
    }
} 