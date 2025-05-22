<?php

class GestorDevolucao {

    public function __construct(
        private RepositorioDevolucao $repositorio,
        private RepositorioLocacao $repositorioLocacao
    ) {}

    /**
     * Calcula o valor pra pagar na devolução
     * 
     * @param array $dadosDevolucao Array com os dados da devolução
     * @return array Dados com o valor a ser pago
     * @throws Exception Se houver algum erro durante o cálculo
     */
    public function calcularValorPagamento($dadosDevolucao) {
        $dadosDevolucao = $this->objectToArray($dadosDevolucao);
        
        if (empty($dadosDevolucao['locacaoId'])) {
            throw new Exception("Locação não informada");
        }
        
        $this->verificarDevolucaoExistente($dadosDevolucao['locacaoId']);
        
        $locacoes = $this->repositorioLocacao->obterPorFiltro($dadosDevolucao['locacaoId']);
        
        if (empty($locacoes)) {
            throw new Exception("Locação não encontrada");
        }
        
        $locacao = $locacoes[0];
        
        if (empty($locacao)) {
            throw new Exception("Locação não encontrada ou em formato inválido");
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
     * @param array $dadosDevolucao Array com os dados da devolução
     * @return array Dados da devolução registrada
     * @throws Exception Se houver algum erro durante o registro
     */
    public function registrarDevolucao($dadosDevolucao) {
        $dadosDevolucao = $this->objectToArray($dadosDevolucao);
        
        if (empty($dadosDevolucao['locacaoId'])) {
            throw new Exception("Locação não informada");
        }
        
        if (empty($dadosDevolucao['registradoPor']) || empty($dadosDevolucao['registradoPor']['codigo'])) {
            throw new Exception("Funcionário não informado");
        }
        
        $locacoes = $this->repositorioLocacao->obterPorFiltro($dadosDevolucao['locacaoId']);
        
        if (empty($locacoes)) {
            throw new Exception("Locação não encontrada");
        }
        
        $locacao = $locacoes[0];
        
        if (empty($locacao)) {
            throw new Exception("Locação não encontrada ou em formato inválido");
        }
        
        $this->verificarDevolucaoExistente($dadosDevolucao['locacaoId']);
        
        date_default_timezone_set('America/Sao_Paulo');
        $dataHoraDevolucao = $dadosDevolucao['dataHoraDevolucao'] ?? date('Y-m-d H:i:s');
        
        if (empty($dadosDevolucao['valorPago'])) {
            $calculadora = new CalculadoraPagamento();
            $valorPago = $calculadora->calcularValorPagamento($locacao, $dataHoraDevolucao);
        } else {
            $valorPago = $dadosDevolucao['valorPago'];
        }
        
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
     * @return array Lista de devoluções
     */
    public function obterDevolucoes($filtro = null) {
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
     * @throws Exception Se a locação já tiver sido devolvida
     */
    private function verificarDevolucaoExistente($locacaoId) {
        $devolucoes = $this->repositorio->obterTodos($locacaoId);
        
        if (!empty($devolucoes)) {
            throw new Exception("Esta locação já foi devolvida");
        }
    }
} 