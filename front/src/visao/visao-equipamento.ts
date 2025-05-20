import type { Equipamento } from "../types/types.js";

export interface VisaoEquipamento {
  filtroEquipamento(): { filtro: string };

  exibirMensagens(erros: string[]): void;
  retornarEquipamento(equipamento: Equipamento): void;
  obterEquipamentosSelecionados(): Equipamento[];
}
