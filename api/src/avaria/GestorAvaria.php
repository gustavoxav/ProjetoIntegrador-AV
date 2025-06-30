<?php

class GestorAvaria {

    public function __construct(
        private RepositorioAvaria $repositorio,
        private RepositorioEquipamento $repositorioEquipamento,
        private ?RepositorioLocacao $repositorioLocacao = null
    ) {}

    /**
     * Registra uma nova avaria no sistema
     * 
     * @param array{
     *   avaliadorId: int,
     *   descricao: string,
     *   valorCobrar: float,
     *   equipamentoId: int,
     *   locacaoId: int,
     *   foto?: array{name: string, tmp_name: string, type: string, size: int}
     * } $dadosAvaria Array com os dados da avaria
     * @return array<string,mixed> Dados da avaria registrada
     * @throws AvariaException Quando há erro nas validações ou no processamento
     */
    public function registrarAvaria(array $dadosAvaria): array {
        $dadosAvaria = $this->objectToArray($dadosAvaria);
        
        $this->validarDadosAvaria($dadosAvaria);
        
        $equipamento = $this->repositorioEquipamento->buscarEquipamentoFiltro($dadosAvaria['equipamentoId']);
        if (!$equipamento) {
            throw new AvariaException("Equipamento não encontrado");
        }
        
        $this->validarEquipamentoNaLocacao($dadosAvaria['equipamentoId'], $dadosAvaria['locacaoId']);
        
        if ($dadosAvaria['valorCobrar'] > $equipamento->getValorCompra()) {
            throw new AvariaException("O valor da avaria não pode ser maior que o valor de compra do equipamento (R$ " . number_format($equipamento->getValorCompra(), 2, ',', '.') . ")");
        }
        
        $id = $this->gerarUUID();
        
        $fotoCaminho = $this->processarUploadFoto($dadosAvaria['foto'] ?? null, $id);
        
        $avaliador = [
            'codigo' => $dadosAvaria['avaliadorId']
        ];
        
        $equipamentoArray = [
            'codigo' => $dadosAvaria['equipamentoId'],
            'descricao' => $equipamento->jsonSerialize()['descricao'] ?? '',
            'valorCompra' => $equipamento->getValorCompra()
        ];
        
        date_default_timezone_set('America/Sao_Paulo');
        $dataHoraLancamento = date('Y-m-d H:i:s');
        
        $avaria = new Avaria(
            $id,
            $dataHoraLancamento,
            $dadosAvaria['descricao'],
            $fotoCaminho,
            $dadosAvaria['valorCobrar'],
            $avaliador,
            $equipamentoArray,
            $dadosAvaria['locacaoId']
        );
        
        return $this->repositorio->salvar($avaria);
    }
    
    /**
     * Obtém uma avaria por ID
     * 
     * @param string $id ID da avaria
     * @return array<string,mixed>|null Dados da avaria ou null se não encontrada
     */
    public function obterAvariaPorId(string $id): ?array {
        return $this->repositorio->obterPorId($id);
    }
    
    /**
     * Obtém avarias de um equipamento específico
     * 
     * @param int $equipamentoId ID do equipamento
     * @return array<int,array<string,mixed>> Lista de avarias
     */
    public function obterAvariasPorEquipamento(int $equipamentoId): array {
        return $this->repositorio->obterPorEquipamento($equipamentoId);
    }
    
    /**
     * Obtém avarias de uma locação específica
     * 
     * @param int $locacaoId ID da locação
     * @return array<int,array<string,mixed>> Lista de avarias
     */
    public function obterAvariasPorLocacao(int $locacaoId): array {
        return $this->repositorio->obterPorLocacao($locacaoId);
    }
    
    /**
     * Remove uma avaria do sistema
     * 
     * @param string $id ID da avaria
     * @return bool True se removida com sucesso
     * @throws AvariaException Quando há erro na remoção
     */
    public function removerAvaria(string $id): bool {
        $avaria = $this->repositorio->obterPorId($id);
        if (!$avaria) {
            throw new AvariaException("Avaria não encontrada");
        }
        
        return $this->repositorio->remover($id);
    }
    
    /**
     * Valida os dados de entrada para registro de avaria
     * 
     * @param array<string,mixed> $dados Dados da avaria
     * @throws AvariaException Quando há erro nas validações
     */
    private function validarDadosAvaria(array $dados): void {
        if (empty($dados['avaliadorId'])) {
            throw new AvariaException("Avaliador é obrigatório");
        }
        
        if (empty($dados['descricao'])) {
            throw new AvariaException("Descrição da avaria é obrigatória");
        }
        
        if (!isset($dados['valorCobrar']) || $dados['valorCobrar'] < 0) {
            throw new AvariaException("Valor a cobrar deve ser maior ou igual a zero");
        }
        
        if (empty($dados['equipamentoId'])) {
            throw new AvariaException("Equipamento é obrigatório");
        }
        
        if (empty($dados['locacaoId'])) {
            throw new AvariaException("Locação é obrigatória");
        }
        
        if (!isset($dados['foto']) || !is_array($dados['foto'])) {
            throw new AvariaException("Foto da avaria é obrigatória");
        }
    }
    
    /**
     * Processa o upload da foto da avaria
     * 
     * @param array{name: string, tmp_name: string, type: string, size: int}|null $foto Dados do arquivo de foto
     * @param string $id UUID da avaria
     * @return string Caminho relativo da foto salva
     * @throws AvariaException Quando há erro no upload
     */
    private function processarUploadFoto(?array $foto, string $id): string {
        if (!$foto || !isset($foto['tmp_name']) || !$foto['tmp_name']) {
            throw new AvariaException("Foto da avaria é obrigatória");
        }
        
        $tipoArquivo = strtolower(pathinfo($foto['name'], PATHINFO_EXTENSION));
        if ($tipoArquivo !== 'jpg' && $tipoArquivo !== 'jpeg') {
            throw new AvariaException("Apenas arquivos JPG são permitidos para fotos de avarias");
        }
        
        if ($foto['type'] !== 'image/jpeg') {
            throw new AvariaException("Tipo de arquivo inválido. Apenas JPG é permitido");
        }
        
        if ($foto['size'] > 5 * 1024 * 1024) {
            throw new AvariaException("Arquivo muito grande. Tamanho máximo: 5MB");
        }
        
        $diretorioFotos = __DIR__ . '/../../fotos/avarias';
        
        if (!is_dir($diretorioFotos)) {
            if (!mkdir($diretorioFotos, 0755, true)) {
                throw new AvariaException("Erro ao criar diretório para fotos");
            }
        }
        
        $nomeArquivo = $id . '.jpg';
        $caminhoCompleto = $diretorioFotos . '/' . $nomeArquivo;
        
        if (!move_uploaded_file($foto['tmp_name'], $caminhoCompleto)) {
            throw new AvariaException("Erro ao salvar arquivo de foto");
        }
        
        return 'fotos/avarias/' . $nomeArquivo;
    }
    
    /**
     * Gera um UUID v4
     * 
     * @return string UUID gerado
     */
    private function gerarUUID(): string {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
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
     * Valida se o equipamento pertence à locação informada
     * 
     * @param int $equipamentoId ID do equipamento
     * @param int $locacaoId ID da locação
     * @throws AvariaException Quando o equipamento não pertence à locação
     */
    private function validarEquipamentoNaLocacao(int $equipamentoId, int $locacaoId): void {
        if (!$this->repositorioLocacao) {
            throw new AvariaException("Repositório de locação não configurado");
        }
        
        $locacao = $this->repositorioLocacao->obterPorId($locacaoId);
        if (!$locacao) {
            throw new AvariaException("Locação não encontrada");
        }
        
        $equipamentoEncontrado = false;
        if (isset($locacao['itens']) && is_array($locacao['itens'])) {
            foreach ($locacao['itens'] as $item) {
                if (isset($item['equipamento']['codigo']) && $item['equipamento']['codigo'] == $equipamentoId) {
                    $equipamentoEncontrado = true;
                    break;
                }
            }
        }
        
        if (!$equipamentoEncontrado) {
            throw new AvariaException("O equipamento não pertence a esta locação. Apenas equipamentos que fazem parte da locação podem ter avarias registradas.");
        }
    }
} 