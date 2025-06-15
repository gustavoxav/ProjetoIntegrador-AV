<?php

class GestorEquipamento
{

    public function __construct(
        private RepositorioEquipamento $repositorioEquipamento
    ) {}

    /**
     * Buscar um Equipamento por Código. Caso não tenha nenhum filtro, retorna todos os equipamentos.
     *
     * @param int|null $filtro
     * @return Equipamento[]
     */
    public function obterEquipamentos(int|null $filtro): array|Equipamento|null
    {
        try {
            if (is_null($filtro)) {
                return $this->repositorioEquipamento->buscarEquipamentos();
            }
            return $this->repositorioEquipamento->buscarEquipamentoFiltro($filtro);
        } catch (\Throwable $error) {
            throw $error;
        }
    }

    public function registrarAvaria(int $equipamentoId, string $novaAvaria): void
    {
        try {
            if (empty($novaAvaria)) {
                throw new \InvalidArgumentException("AO campo de avaria não pode estar vazia.");
            }

            $equipamento = $this->repositorioEquipamento->buscarEquipamentoFiltro($equipamentoId);

            if (!$equipamento) {
                throw new \InvalidArgumentException("O id do equipamento não pode ser encontrado. ID: $equipamentoId.");
            }

            $avariasAtuais = trim($equipamento->avarias);
            $novasAvarias = $avariasAtuais && $avariasAtuais !== "Nenhuma avaria"
                ? $avariasAtuais . "; " . $novaAvaria
                : $novaAvaria;

            $this->repositorioEquipamento->adicionarAvarias($equipamentoId, $novasAvarias);
        } catch (\Throwable $e) {
            throw new \ErroAtualizacaoEquipamentoException("Erro ao registrar avaria: " . $e->getMessage(), 0, $e);
        }
    }
}
