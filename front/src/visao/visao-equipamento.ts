import { Equipamento } from "../types/types";

export interface VisaoEquipamento {
  filtroEquipamento(): { filtro: string };

  exibirMensagens(mensagens: string[]): void;
  retornarEquipamento(equipamento: Equipamento): void;
}
