<?php

class GestorLocacao {

    public function __construct(
      private RepositorioLocacao $repositorio
  ) {}

    /**
     * Registra uma nova locação no sistema
     * 
     * @param array $dadosLocacao Array com os dados da locação
     * @return array Dados da locação registrada
     * @throws Exception Se houver algum erro durante o registro
     */
    public function registrarLocacao($dadosLocacao) {
        $dadosLocacao = $this->objectToArray($dadosLocacao);
        
        if (empty($dadosLocacao['cliente']) || empty($dadosLocacao['cliente']['codigo'])) {
            throw new Exception("Cliente não informado");
        }
        
        if (empty($dadosLocacao['registradoPor']) || empty($dadosLocacao['registradoPor']['codigo'])) {
            throw new Exception("Funcionário não informado");
        }
        
        if (empty($dadosLocacao['itens']) || count($dadosLocacao['itens']) === 0) {
            throw new Exception("Nenhum item adicionado à locação");
        }
        
        if (empty($dadosLocacao['horasContratadas']) || $dadosLocacao['horasContratadas'] <= 0) {
            throw new Exception("Horas contratadas inválidas");
        }
        
        $itens = [];
        foreach ($dadosLocacao['itens'] as $itemData) {
            if (empty($itemData['equipamento']) || empty($itemData['equipamento']['codigo'])) {
                throw new Exception("Equipamento não informado");
            }
            
            if (!$itemData['equipamento']['disponivel']) {
                throw new Exception("Equipamento {$itemData['equipamento']['codigo']} não está disponível");
            }
            
            $item = new ItemLocado(
                null,
                $dadosLocacao['horasContratadas'],
                $itemData['equipamento']
            );
            
            $itens[] = $item;
        }
        
        date_default_timezone_set('America/Sao_Paulo');
        
        $locacao = new Locacao(
            null,
            date('Y-m-d H:i:s'), // ESSE É O CERTO!
            // '2025-05-23 00:15:00', // MODIFICAR PARA DATA E HORA ATUAL DE TESTE
            $dadosLocacao['horasContratadas'],
            $dadosLocacao['cliente'],
            $dadosLocacao['registradoPor'],
            $itens
        );
        
        $locacaoSalva = $this->repositorio->salvar($locacao);
        
        return $locacaoSalva;
    }
    
    /**
     * Converte recursivamente objetos stdClass para arrays associativos
     * 
     * @param mixed $obj O objeto a ser convertido
     * @return mixed O array resultante ou o valor original se não for um objeto
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
     * Obtém locações do sistema, com filtro opcional
     * 
     * @param string|null $filtro Filtro opcional por código do cliente ou funcionário
     * @return array Lista de locações
     */
    public function obterLocacoes($filtro = null) {
        $locacoes = $this->repositorio->obterTodos($filtro);
        
        $resultado = [];
        foreach ($locacoes as $locacao) {
            $resultado[] = $locacao;
        }
        
        return $resultado;
    }
    
    /**
     * Obtém uma locação específica pelo código
     * 
     * @param int $filtro Código da locação
     * @return array|null Dados da locação ou null se não encontrada
     */
    public function obterLocacaoPorFiltro($filtro) {
        $locacao = $this->repositorio->obterPorFiltro($filtro);
        
        if (!$locacao) {
            return null;
        }
        
        return $locacao;
    }
}
