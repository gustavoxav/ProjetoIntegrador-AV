<?php

class GestorEquipamento
{

    public function __construct(
        private RepositorioEquipamento $repositorioEquipamento,
        private ?RepositorioAvaria $repositorioAvaria = null
    ) {}

    /**
     * Buscar um Equipamento por Código. Caso não tenha nenhum filtro, retorna todos os equipamentos.
     *
     * @param int|null $filtro
     * @return Equipamento[]|array<string,mixed>
     */
    public function obterEquipamentos(int|null $filtro): array|Equipamento|null
    {
        try {
            if (is_null($filtro)) {
                $equipamentos = $this->repositorioEquipamento->buscarEquipamentos();
                
                if ($this->repositorioAvaria && $equipamentos) {
                    $equipamentosComAvarias = [];
                    foreach ($equipamentos as $equipamento) {
                        $dadosEquipamento = $equipamento->jsonSerialize();
                        $avarias = $this->repositorioAvaria->obterPorEquipamento($dadosEquipamento['codigo']);
                        
                        $dadosEquipamento['avariasDetalhadas'] = array_map(function($avaria) {
                            return [
                                'id' => $avaria['id'],
                                'descricao' => $avaria['descricao'],
                                'dataHoraLancamento' => $avaria['dataHoraLancamento'],
                                'valorCobrar' => $avaria['valorCobrar']
                            ];
                        }, $avarias);
                        
                        $avariasOriginais = trim($dadosEquipamento['avarias']);
                        $descricoesDasAvarias = array_map(function($avaria) {
                            return $avaria['descricao'];
                        }, $avarias);
                        
                        if (!empty($descricoesDasAvarias)) {
                            $novasDescricoes = implode('; ', $descricoesDasAvarias);
                            if ($avariasOriginais && $avariasOriginais !== "Nenhuma avaria") {
                                $dadosEquipamento['avarias'] = $avariasOriginais . '; ' . $novasDescricoes;
                            } else {
                                $dadosEquipamento['avarias'] = $novasDescricoes;
                            }
                        }
                        
                        $equipamentosComAvarias[] = $dadosEquipamento;
                    }
                    return $equipamentosComAvarias;
                }
                
                return $equipamentos;
            }
            
            $equipamento = $this->repositorioEquipamento->buscarEquipamentoFiltro($filtro);
            
            if ($this->repositorioAvaria && $equipamento) {
                $dadosEquipamento = $equipamento->jsonSerialize();
                $avarias = $this->repositorioAvaria->obterPorEquipamento($dadosEquipamento['codigo']);
                
                $dadosEquipamento['avariasDetalhadas'] = array_map(function($avaria) {
                    return [
                        'id' => $avaria['id'],
                        'descricao' => $avaria['descricao'],
                        'dataHoraLancamento' => $avaria['dataHoraLancamento'],
                        'valorCobrar' => $avaria['valorCobrar']
                    ];
                }, $avarias);
                
                $avariasOriginais = trim($dadosEquipamento['avarias']);
                $descricoesDasAvarias = array_map(function($avaria) {
                    return $avaria['descricao'];
                }, $avarias);
                
                if (!empty($descricoesDasAvarias)) {
                    $novasDescricoes = implode('; ', $descricoesDasAvarias);
                    if ($avariasOriginais && $avariasOriginais !== "Nenhuma avaria") {
                        $dadosEquipamento['avarias'] = $avariasOriginais . '; ' . $novasDescricoes;
                    } else {
                        $dadosEquipamento['avarias'] = $novasDescricoes;
                    }
                }
                
                return $dadosEquipamento;
            }
            
            return $equipamento;
        } catch (\Throwable $error) {
            throw $error;
        }
    }
}
