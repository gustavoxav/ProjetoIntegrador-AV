<?php

require_once 'RepositorioLocacao.php';

class RepositorioLocacaoEmBDR implements RepositorioLocacao {

    public function __construct(
      private PDO $pdo
    ) {}

    public function salvar(Locacao $locacao) {
        try {
            $this->pdo->beginTransaction();
            
            $stmt = $this->pdo->prepare('
                INSERT INTO locacao 
                (data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, 
                desconto, valor_total, cliente_id, funcionario_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ');
            
            $stmt->execute([
                $locacao->getDataHoraLocacao(),
                $locacao->getHorasContratadas(),
                $locacao->getDataHoraEntregaPrevista(),
                $locacao->getDesconto(),
                $locacao->getValorTotal(),
                $locacao->getCliente()['codigo'],
                $locacao->getRegistradoPor()['codigo']
            ]);
            
            $codigoLocacao = $this->pdo->lastInsertId();
            
            foreach ($locacao->getItens() as $item) {
                $stmtItem = $this->pdo->prepare('
                    INSERT INTO item_locado 
                    (tempo_contratado, subtotal, equipamento_id, locacao_id) 
                    VALUES (?, ?, ?, ?)
                ');
                
                $stmtItem->execute([
                    $item->getTempoContratado(),
                    $item->getSubtotal(),
                    $item->getEquipamento()['codigo'],
                    $codigoLocacao
                ]);
                
                $stmtEquip = $this->pdo->prepare('
                    UPDATE equipamento 
                    SET disponivel = 0 
                    WHERE id = ?
                ');
                
                $stmtEquip->execute([$item->getEquipamento()['codigo']]);
            }
            
            $this->pdo->commit();
            
            return $this->obterPorCodigo($codigoLocacao);
            
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
    
    public function obterPorCodigo($codigo) {
        $stmt = $this->pdo->prepare('
            SELECT l.*, 
                c.id as cliente_id, c.nome_completo as cliente_nome, 
                f.id as funcionario_id, f.nome as funcionario_nome
            FROM locacao l
            INNER JOIN cliente c ON l.cliente_id = c.id
            INNER JOIN funcionario f ON l.funcionario_id = f.id
            WHERE l.id = ?
        ');
        
        $stmt->execute([$codigo]);
        $locacaoData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$locacaoData) {
            return null;
        }
        
        $stmtItens = $this->pdo->prepare('
            SELECT i.*, e.*
            FROM item_locado i
            INNER JOIN equipamento e ON i.equipamento_id = e.id
            WHERE i.locacao_id = ?
        ');
        
        $stmtItens->execute([$codigo]);
        $itens = $stmtItens->fetchAll(PDO::FETCH_ASSOC);
        
        $cliente = [
            'codigo' => $locacaoData['cliente_id'],
            'nomeCompleto' => $locacaoData['cliente_nome']
        ];
        
        $funcionario = [
            'codigo' => $locacaoData['funcionario_id'],
            'nome' => $locacaoData['funcionario_nome']
        ];
        
        $itensObj = [];
        foreach ($itens as $item) {
            $equipamento = [
                'codigo' => $item['id'],
                'modelo' => $item['modelo'],
                'fabricante' => $item['fabricante'],
                'descricao' => $item['descricao'],
                'valorHora' => $item['valor_hora'],
                'avarias' => $item['avarias'],
                'disponivel' => (bool)$item['disponivel']
            ];
            
            $itemObj = new ItemLocado(
                $item['id'],
                $item['tempo_contratado'],
                $equipamento
            );
            
            $itensObj[] = $itemObj;
        }
        
        return new Locacao(
            $locacaoData['id'],
            $locacaoData['data_hora_locacao'],
            $locacaoData['horas_contratadas'],
            $cliente,
            $funcionario,
            $itensObj
        );
    }
    
    public function obterTodos($filtro = null) {
        $sql = '
            SELECT l.*, 
                c.id as cliente_id, c.nome_completo as cliente_nome,
                f.id as funcionario_id, f.nome as funcionario_nome
            FROM locacao l
            INNER JOIN cliente c ON l.cliente_id = c.id
            INNER JOIN funcionario f ON l.funcionario_id = f.id
        ';
        
        $params = [];
        
        if ($filtro) {
            $sql .= ' WHERE c.id = ? OR f.id = ?';
            $params = [$filtro, $filtro];
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $locacoesData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $locacoes = [];
        foreach ($locacoesData as $locacaoData) {
            $locacoes[] = $this->obterPorCodigo($locacaoData['id']);
        }
        
        return $locacoes;
    }
}
