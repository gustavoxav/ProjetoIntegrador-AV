<?php

interface RepositorioAvaria {
    /**
     * Salva uma avaria no repositório
     * 
     * @param Avaria $avaria A avaria a ser salva
     * @return array<string,mixed> Dados da avaria salva
     */
    public function salvar(Avaria $avaria): array;

    /**
     * Obtém uma avaria por ID
     * 
     * @param string $id ID da avaria
     * @return array<string,mixed>|null Dados da avaria ou null se não encontrada
     */
    public function obterPorId(string $id): ?array;

    /**
     * Obtém todas as avarias de um equipamento
     * 
     * @param int $equipamentoId ID do equipamento
     * @return array<int,array<string,mixed>> Lista de avarias
     */
    public function obterPorEquipamento(int $equipamentoId): array;

    /**
     * Obtém todas as avarias de uma locação
     * 
     * @param int $locacaoId ID da locação
     * @return array<int,array<string,mixed>> Lista de avarias
     */
    public function obterPorLocacao(int $locacaoId): array;

    /**
     * Remove uma avaria
     * 
     * @param string $id ID da avaria
     * @return bool True se removida com sucesso
     */
    public function remover(string $id): bool;
} 