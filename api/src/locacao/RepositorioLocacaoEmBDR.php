<?php

class RepositorioLocacaoEmBDR implements RepositorioLocacao
{

    public function __construct(
        private PDO $pdo
    ) {}

    /**
     * Salva uma locação no repositório
     * @param Locacao $locacao A locação a ser salva
     * @return array<string,mixed> A locação salva com código gerado
     * @throws Exception erro
     */
    public function salvar(Locacao $locacao)
    {
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
            return $this->obterPorId((int)$codigoLocacao);
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    /**
     * Obtém uma locação pelo código
     * @param int|string $filtro O código da locação ou CPF do cliente
     * @return array<int,array<string,mixed>> A locação encontrada ou array vazio se não existir
     * @throws Exception erro
     */
    public function obterPorFiltro($filtro)
    {
        if (strlen((string)$filtro) !== 11) {
            $locacao = $this->obterPorId((int)$filtro);
            return $locacao ? [$locacao] : [];
        }

        $query = '
        SELECT l.*, 
            c.id as cliente_id, c.nome_completo as cliente_nome, 
            c.telefone as cliente_telefone,
            f.id as funcionario_id, f.nome as funcionario_nome,
            d.id as devolucao_id
        FROM locacao l
        INNER JOIN cliente c ON l.cliente_id = c.id
        INNER JOIN funcionario f ON l.funcionario_id = f.id
        LEFT JOIN devolucao d ON l.id = d.locacao_id
        WHERE c.cpf = ? ORDER BY l.data_hora_locacao DESC';

        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$filtro]);
        $locacoesData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$locacoesData) {
            return [];
        }

        $locacoes = [];

        foreach ($locacoesData as $locacaoData) {
            $locacaoId = $locacaoData['id'];

            $stmtItens = $this->pdo->prepare('
            SELECT i.*, e.*
            FROM item_locado i
            INNER JOIN equipamento e ON i.equipamento_id = e.id
            WHERE i.locacao_id = ?
        ');

            $stmtItens->execute([$locacaoId]);
            $itens = $stmtItens->fetchAll(PDO::FETCH_ASSOC);

            $cliente = [
                'codigo' => $locacaoData['cliente_id'],
                'nomeCompleto' => $locacaoData['cliente_nome'],
                'telefone' => $locacaoData['cliente_telefone']
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
                    'valorHora' => (float)$item['valor_hora'],
                    'avarias' => $item['avarias'],
                    'numeroSeguro' => $item['numero_seguro'],
                    'disponivel' => (bool)$item['disponivel']
                ];

                $itemObj = new ItemLocado(
                    $item['id'],
                    $item['tempo_contratado'],
                    $equipamento
                );

                $itensObj[] = $itemObj;
            }

            $locacao = new Locacao(
                $locacaoData['id'],
                $locacaoData['data_hora_locacao'],
                $locacaoData['horas_contratadas'],
                $cliente,
                $funcionario,
                $itensObj
            );

            $locacaoArray = $locacao->toArray();
            $locacaoArray['devolvida'] = !is_null($locacaoData['devolucao_id']);
            $locacoes[] = $locacaoArray;
        }

        return $locacoes;
    }

    /**
     * Obtém uma locação pelo ID
     * @param int $id O código da locação
     * @return array<string,mixed>|null A locação encontrada ou null se não existir
     * @throws Exception erro
     */
    public function obterPorId($id) {
        $query = '
        SELECT l.*, 
            c.id as cliente_id, c.nome_completo as cliente_nome, 
            c.telefone as cliente_telefone,
            f.id as funcionario_id, f.nome as funcionario_nome,
            d.id as devolucao_id
        FROM locacao l
        INNER JOIN cliente c ON l.cliente_id = c.id
        INNER JOIN funcionario f ON l.funcionario_id = f.id
        LEFT JOIN devolucao d ON l.id = d.locacao_id
        WHERE l.id = ?';

        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$id]);
        $locacaoData = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$locacaoData) {
            return null;
        }

        $locacaoId = $locacaoData['id'];

        $stmtItens = $this->pdo->prepare('
            SELECT i.*, e.*
            FROM item_locado i
            INNER JOIN equipamento e ON i.equipamento_id = e.id
            WHERE i.locacao_id = ?
        ');

        $stmtItens->execute([$locacaoId]);
        $itens = $stmtItens->fetchAll(PDO::FETCH_ASSOC);

        $cliente = [
            'codigo' => $locacaoData['cliente_id'],
            'nomeCompleto' => $locacaoData['cliente_nome'],
            'telefone' => $locacaoData['cliente_telefone']
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
                'valorHora' => (float)$item['valor_hora'],
                'avarias' => $item['avarias'],
                'numeroSeguro' => $item['numero_seguro'],
                'disponivel' => (bool)$item['disponivel']
            ];

            $itemObj = new ItemLocado(
                $item['id'],
                $item['tempo_contratado'],
                $equipamento
            );

            $itensObj[] = $itemObj;
        }

        $locacao = new Locacao(
            $locacaoData['id'],
            $locacaoData['data_hora_locacao'],
            $locacaoData['horas_contratadas'],
            $cliente,
            $funcionario,
            $itensObj
        );

        $locacaoArray = $locacao->toArray();
        $locacaoArray['devolvida'] = !is_null($locacaoData['devolucao_id']);
        return $locacaoArray;
    }

    /**
     * Obtém todas as locações ou filtra por cliente ou funcionário
     * @param int|string|null $filtro Filtro opcional por código do cliente ou funcionário
     * @return array<int,array<string,mixed>> Lista de locações
     * @throws Exception erro
     */
    public function obterTodos($filtro = null)
    {
        if ($filtro) {
            return $this->obterPorFiltro($filtro);
        }

        $sql = '
            SELECT l.*, 
            c.id as cliente_id, c.nome_completo as cliente_nome, c.telefone as cliente_telefone,
            f.id as funcionario_id, f.nome as funcionario_nome,
            d.id as devolucao_id
            FROM locacao l
            INNER JOIN cliente c ON l.cliente_id = c.id
            INNER JOIN funcionario f ON l.funcionario_id = f.id
            LEFT JOIN devolucao d ON l.id = d.locacao_id
            ORDER BY l.id DESC
        ';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $locacoesData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $locacoes = [];
        foreach ($locacoesData as $locacaoData) {
            $locacao = $this->obterPorId($locacaoData['id']);
            $locacao['devolvida'] = !is_null($locacaoData['devolucao_id']);
            $locacoes[] = $locacao;
        }

        return $locacoes;
    }
}
