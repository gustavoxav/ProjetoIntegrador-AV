import type { Equipamento } from "../types/types.js";

export interface VisaoEquipamento {
  filtroEquipamento(): { filtro: string };
  exibirEquipamentosDevolucao(equipamentos: Equipamento[], horas: number): void;
  exibirMensagens(erros: string[]): void;
  retornarEquipamento(equipamento: Equipamento): void;
  retornarTodosEquipamentos(equipamentos: Equipamento[]): void;
  obterEquipamentosSelecionados(): Equipamento[];
}
