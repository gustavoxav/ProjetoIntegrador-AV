<?php

class GestorDevolucao {

    public function __construct(
        private RepositorioDevolucao $repositorio,
        private RepositorioLocacao $repositorioLocacao
    ) {}

    /**
     * Calcula o valor pra pagar na devolução
     * 
     * @param array{
     *   locacaoId: int,
     *   dataHoraDevolucao?: string
     * } $dadosDevolucao Array com os dados da devolução
     * @return array{
     *   locacao: array<string,mixed>,
     *   dataHoraDevolucao: string,
     *   valorPago: float
     * } Dados com o valor a ser pago
     * @throws Exception erro
     */
    public function calcularValorPagamento(array $dadosDevolucao): array {
        $dadosDevolucao = $this->objectToArray($dadosDevolucao);
        
        if (empty($dadosDevolucao['locacaoId'])) {
            throw new Exception("Locação não informada");
        }
        
        $this->verificarDevolucaoExistente($dadosDevolucao['locacaoId']);
        
        $locacao = $this->repositorioLocacao->obterPorId($dadosDevolucao['locacaoId']);
        
        if (!$locacao) {
            throw new Exception("Locação não encontrada para o ID: " . $dadosDevolucao['locacaoId']);
        }
        
        date_default_timezone_set('America/Sao_Paulo');
        $dataHoraDevolucao = $dadosDevolucao['dataHoraDevolucao'] ?? date('Y-m-d H:i:s');
        
        $calculadora = new CalculadoraPagamento();
        $valorPago = $calculadora->calcularValorPagamento($locacao, $dataHoraDevolucao);
        
        return [
            'locacao' => $locacao,
            'dataHoraDevolucao' => $dataHoraDevolucao,
            'valorPago' => $valorPago
        ];
    }

    /**
     * Registra uma nova devolução no sistema
     * 
     * @param array{
     *   locacaoId: int,
     *   registradoPor: array{codigo: int, nome?: string},
     *   valorPago: float,
     *   dataHoraDevolucao?: string
     * } $dadosDevolucao Array com os dados da devolução
     * @return array<string,mixed> Dados da devolução registrada
     * @throws Exception erro
     */
    public function registrarDevolucao(array $dadosDevolucao): array {
        $dadosDevolucao = $this->objectToArray($dadosDevolucao);
        
        if (empty($dadosDevolucao['locacaoId'])) {
            throw new Exception("Locação não informada");
        }
        
        if (empty($dadosDevolucao['registradoPor']) || empty($dadosDevolucao['registradoPor']['codigo'])) {
            throw new Exception("Funcionário não informado");
        }
        
        if (empty($dadosDevolucao['valorPago']) && $dadosDevolucao['valorPago'] !== 0) {
            throw new Exception("Valor pago é obrigatório");
        }
        
        $locacao = $this->repositorioLocacao->obterPorId($dadosDevolucao['locacaoId']);
        
        if (!$locacao) {
            throw new Exception("Locação não encontrada para o ID: " . $dadosDevolucao['locacaoId']);
        }
        
        $this->verificarDevolucaoExistente($dadosDevolucao['locacaoId']);
        
        date_default_timezone_set('America/Sao_Paulo');
        $dataHoraDevolucao = $dadosDevolucao['dataHoraDevolucao'] ?? date('Y-m-d H:i:s');
        
        $calculadora = new CalculadoraPagamento();
        $valorCalculado = $calculadora->calcularValorPagamento($locacao, $dataHoraDevolucao);
        
        $valorPago = floatval($dadosDevolucao['valorPago']);
        if (abs($valorPago - $valorCalculado) > 0.01) {
            throw new Exception("O valor informado não está correto. Valor esperado: R$ " . number_format($valorCalculado, 2, ',', '.') . ". Tente novamente.");
        }
        
        $valorPago = $valorCalculado;
        
        if ($valorPago <= 0) {
            throw new Exception("Valor pago inválido");
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
     * @throws Exception erro
     */
    private function verificarDevolucaoExistente(int $locacaoId): void {
        $devolucoes = $this->repositorio->obterTodos((string)$locacaoId, true);
        
        if (!empty($devolucoes)) {
            throw new Exception("Esta locação já foi devolvida");
        }
    }
} 