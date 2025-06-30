<?php

class RepositorioAvariaEmBDR implements RepositorioAvaria {

    public function __construct(
        private PDO $pdo
    ) {}

    public function salvar(Avaria $avaria): array {
        try {
            $this->pdo->beginTransaction();
            
            $stmt = $this->pdo->prepare('
                INSERT INTO avaria 
                (id, data_hora_lancamento, avaliador_id, descricao, foto_caminho, valor_cobrar, equipamento_id, locacao_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ');
            
            $stmt->execute([
                $avaria->getId(),
                $avaria->getDataHoraLancamento(),
                $avaria->getAvaliador()['codigo'],
                $avaria->getDescricao(),
                $avaria->getFotoCaminho(),
                $avaria->getValorCobrar(),
                $avaria->getEquipamento()['codigo'],
                $avaria->getLocacaoId()
            ]);
            
            $this->pdo->commit();
            
            return $this->obterPorId($avaria->getId());
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            throw new AvariaException("Erro ao salvar avaria: " . $e->getMessage());
        }
    }
    
    public function obterPorId(string $id): ?array {
        $query = '
            SELECT a.*, 
                f.id as avaliador_id, f.nome as avaliador_nome,
                e.id as equipamento_id, e.descricao as equipamento_descricao, e.valor_compra as equipamento_valor_compra
            FROM avaria a
            INNER JOIN funcionario f ON a.avaliador_id = f.id
            INNER JOIN equipamento e ON a.equipamento_id = e.id
            WHERE a.id = ?
        ';
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$id]);
        $avariaData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$avariaData) {
            return null;
        }
        
        return $this->construirAvariaArray($avariaData);
    }
    
    public function obterPorEquipamento(int $equipamentoId): array {
        $query = '
            SELECT a.*, 
                f.id as avaliador_id, f.nome as avaliador_nome,
                e.id as equipamento_id, e.descricao as equipamento_descricao, e.valor_compra as equipamento_valor_compra
            FROM avaria a
            INNER JOIN funcionario f ON a.avaliador_id = f.id
            INNER JOIN equipamento e ON a.equipamento_id = e.id
            WHERE a.equipamento_id = ?
            ORDER BY a.data_hora_lancamento DESC
        ';
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$equipamentoId]);
        $avariasData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $avarias = [];
        foreach ($avariasData as $avariaData) {
            $avarias[] = $this->construirAvariaArray($avariaData);
        }
        
        return $avarias;
    }
    
    public function obterPorLocacao(int $locacaoId): array {
        $query = '
            SELECT a.*, 
                f.id as avaliador_id, f.nome as avaliador_nome,
                e.id as equipamento_id, e.descricao as equipamento_descricao, e.valor_compra as equipamento_valor_compra
            FROM avaria a
            INNER JOIN funcionario f ON a.avaliador_id = f.id
            INNER JOIN equipamento e ON a.equipamento_id = e.id
            WHERE a.locacao_id = ?
            ORDER BY a.data_hora_lancamento DESC
        ';
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$locacaoId]);
        $avariasData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $avarias = [];
        foreach ($avariasData as $avariaData) {
            $avarias[] = $this->construirAvariaArray($avariaData);
        }
        
        return $avarias;
    }
    
    public function remover(string $id): bool {
        try {
            $this->pdo->beginTransaction();
            
            $avaria = $this->obterPorId($id);
            if (!$avaria) {
                $this->pdo->rollBack();
                return false;
            }
            
            $caminhoCompleto = __DIR__ . '/../../' . $avaria['fotoCaminho'];
            if (file_exists($caminhoCompleto)) {
                unlink($caminhoCompleto);
            }
            
            $stmt = $this->pdo->prepare('DELETE FROM avaria WHERE id = ?');
            $stmt->execute([$id]);
            
            $this->pdo->commit();
            
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            throw new AvariaException("Erro ao remover avaria: " . $e->getMessage());
        }
    }
    
    /**
     * Constrói um array com os dados da avaria a partir dos dados do banco
     * 
     * @param array<string,mixed> $avariaData Dados da avaria do banco
     * @return array<string,mixed> Array estruturado da avaria
     */
    private function construirAvariaArray(array $avariaData): array {
        $avaliador = [
            'codigo' => $avariaData['avaliador_id'],
            'nome' => $avariaData['avaliador_nome']
        ];
        
        $equipamento = [
            'codigo' => $avariaData['equipamento_id'],
            'descricao' => $avariaData['equipamento_descricao'],
            'valorCompra' => floatval($avariaData['equipamento_valor_compra'])
        ];
        
        $avaria = new Avaria(
            $avariaData['id'],
            $avariaData['data_hora_lancamento'],
            $avariaData['descricao'],
            $avariaData['foto_caminho'],
            floatval($avariaData['valor_cobrar']),
            $avaliador,
            $equipamento,
            intval($avariaData['locacao_id'])
        );
        
        $avariaArray = $avaria->toArray();
        $avariaArray['foto'] = '/api/avarias/foto/' . $avariaData['id'];
        
        return $avariaArray;
    }
} 