import { Equipamento } from "./Equipamento";
import { Locacao } from "./Locacao";

export class ItemLocado {
  constructor(
    public codigo: Number = 0,
    public tempoContratado: number = 0,
    public subtotal: number = 0,
    public equipamento: Equipamento = new Equipamento(),
    public locacao: Locacao = new Locacao()
  ) {}
}