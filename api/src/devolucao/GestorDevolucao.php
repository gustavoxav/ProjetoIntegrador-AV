<?php

class GestorDevolucao {

    public function __construct(
        private RepositorioDevolucao $repositorio,
        private RepositorioLocacao $repositorioLocacao,
        private ?RepositorioAvaria $repositorioAvaria = null
    ) {}

    /**
     * Simula uma devolução calculando o valor a ser pago com taxas e avarias
     * 
     * @param array{
     *   locacaoId: int,
     *   dataHoraDevolucao?: string,
     *   taxasLimpeza?: array<int, bool>
     * } $dadosDevolucao Array com os dados da devolução
     * @return array{
     *   locacao: array<string,mixed>,
     *   dataHoraDevolucao: string,
     *   valorPago: float,
     *   valorBase: float,
     *   valorTaxaLimpeza: float,
     *   valorAvarias: float,
     *   horasReais: int,
     *   detalhesItens: array<int, array{
     *     equipamentoId: int,
     *     subtotal: float,
     *     taxaLimpeza: float,
     *     valorComTaxa: float
     *   }>
     * } Dados detalhados da simulação
     * @throws DevolucaoException
     */
    public function simularDevolucao(array $dadosDevolucao): array {
        if (!isset($dadosDevolucao['locacaoId'])) {
            throw new DevolucaoException("ID da locação é obrigatório");
        }
        
        
        $this->verificarDevolucaoExistente($dadosDevolucao['locacaoId']);
        

        $this->verificarDevolucaoExistente($dadosDevolucao['locacaoId']);
        
        $locacao = $this->repositorioLocacao->obterPorId($dadosDevolucao['locacaoId']);
        
        if (!$locacao) {
            throw new DevolucaoException("Locação não encontrada");
        }

        $this->verificarDevolucaoExistente($dadosDevolucao['locacaoId']);

        $dataHoraDevolucao = $dadosDevolucao['dataHoraDevolucao'] ?? date('Y-m-d H:i:s');
        $taxasLimpeza = $dadosDevolucao['taxasLimpeza'] ?? null;
        
        if ($taxasLimpeza !== null) {
            $taxasLimpeza = $this->objectToArray($taxasLimpeza);
        }
        
        $calculadora = new CalculadoraPagamento($this->repositorioAvaria);
        /** @var array{dataHoraLocacao: string, horasContratadas: int, dataHoraEntregaPrevista: string, codigo?: int, itens: array<int, array{equipamento: array{codigo: int, valorHora: float}}>} $locacao */
        $resultado = $calculadora->calcularValorPagamento($locacao, $dataHoraDevolucao, $taxasLimpeza);
        
        return [
            'locacao' => $locacao,
            'dataHoraDevolucao' => $dataHoraDevolucao,
            'valorPago' => $resultado['valorTotal'],
            'valorBase' => $resultado['valorBase'],
            'valorTaxaLimpeza' => $resultado['valorTaxaLimpeza'],
            'valorAvarias' => $resultado['valorAvarias'],
            'horasReais' => $resultado['horasReais'],
            'detalhesItens' => $resultado['detalhesItens']
        ];
    }

    /**
     * Calcula o valor de pagamento
     * 
     * @param array{
     *   locacaoId: int,
     *   dataHoraDevolucao?: string,
     *   taxasLimpeza?: array<int, bool>
     * } $dadosDevolucao Array com os dados da devolução
     * @return array{
     *   locacao: array<string,mixed>,
     *   dataHoraDevolucao: string,
     *   valorPago: float
     * } Dados da simulação
     * @throws DevolucaoException
     */
    public function calcularValorPagamento(array $dadosDevolucao): array {
        $resultado = $this->simularDevolucao($dadosDevolucao);
        
        return [
            'locacao' => $resultado['locacao'],
            'dataHoraDevolucao' => $resultado['dataHoraDevolucao'],
            'valorPago' => $resultado['valorPago']
        ];
    }

    /**
     * Registra uma nova devolução no sistema
     * 
     * @param array{
     *   locacaoId: int,
     *   registradoPor: array{codigo: int, nome?: string},
     *   valorPago: float,
     *   dataHoraDevolucao?: string,
     *   taxasLimpeza?: array<int, bool>
     * } $dadosDevolucao Array com os dados da devolução
     * @return array<string,mixed> Dados da devolução registrada
     * @throws InvalidArgumentException erro
     */
    public function registrarDevolucao(array $dadosDevolucao): array {
        $dadosDevolucao = $this->objectToArray($dadosDevolucao);
        
        if (empty($dadosDevolucao['locacaoId'])) {
            throw new InvalidArgumentException("Locação não informada");
        }
        
        if (empty($dadosDevolucao['registradoPor']) || empty($dadosDevolucao['registradoPor']['codigo'])) {
            throw new InvalidArgumentException("Funcionário não informado");
        }
        
        if (!isset($dadosDevolucao['valorPago'])) {
            throw new InvalidArgumentException("Valor pago é obrigatório");
        }
        
        if ($dadosDevolucao['valorPago'] === '') {
            throw new InvalidArgumentException("Valor pago é obrigatório e não pode ser uma string vazia");
        }
        
        $locacao = $this->repositorioLocacao->obterPorId($dadosDevolucao['locacaoId']);
        
        if (!$locacao) {
            throw new InvalidArgumentException("Locação não encontrada para o ID: " . $dadosDevolucao['locacaoId']);
        }
        
        $this->verificarDevolucaoExistente($dadosDevolucao['locacaoId']);
        
        date_default_timezone_set('America/Sao_Paulo');
        $dataHoraDevolucao = $dadosDevolucao['dataHoraDevolucao'] ?? date('Y-m-d H:i:s');
        
        $calculadora = new CalculadoraPagamento($this->repositorioAvaria);
        $taxasLimpeza = $dadosDevolucao['taxasLimpeza'] ?? null;
        
        if ($taxasLimpeza !== null) {
            $taxasLimpeza = $this->objectToArray($taxasLimpeza);
        }
        
        /** @var array{dataHoraLocacao: string, horasContratadas: int, dataHoraEntregaPrevista: string, codigo?: int, itens: array<int, array{equipamento: array{codigo: int, valorHora: float}}>} $locacao */
        $valorCalculado = $calculadora->calcularValorPagamentoSimples($locacao, $dataHoraDevolucao, $taxasLimpeza);
        
        $valorPago = $valorCalculado;
        
        if ($valorPago <= 0) {
            throw new InvalidArgumentException("Valor pago inválido");
        }
        
        $devolucao = new Devolucao(
            null,
            $dataHoraDevolucao,
            $valorPago,
            $locacao,
            $dadosDevolucao['registradoPor']
        );
        
        $devolucaoSalva = $this->repositorio->salvar($devolucao);
        
        return $devolucaoSalva;
    }
    
    /**
     * Obtém devoluções do sistema, com filtro opcional
     * 
     * @param string|null $filtro Filtro opcional por código da locação ou funcionário
     * @return array<int,array<string,mixed>> Lista de devoluções
     */
    public function obterDevolucoes(?string $filtro = null): array {
        $devolucoes = $this->repositorio->obterTodos($filtro);
        
        return $devolucoes;
    }
    
    /**
     * Converte objetos para arrays
     * 
     * @param mixed $obj O objeto
     * @return mixed O array
     */
    private function objectToArray($obj) {
        if (is_object($obj)) {
            $obj = (array) $obj;
        }
        
        if (is_array($obj)) {
            $new = [];
            foreach ($obj as $key => $val) {
                $new[$key] = $this->objectToArray($val);
            }
            return $new;
        }
        
        return $obj;
    }
    
    /**
     * Verifica se uma locação já possui uma devolução
     * 
     * @param int $locacaoId ID da locação a ser verificada
     * @return void
     * @throws DevolucaoException erro
     */
    private function verificarDevolucaoExistente(int $locacaoId): void {
        $devolucoes = $this->repositorio->obterTodos((string)$locacaoId, true);
        
        if (!empty($devolucoes)) {
            throw new DevolucaoException("Esta locação já foi devolvida");
        }
    }
}
