import { Cliente } from "./Cliente";
import { Funcionario } from "./Funcionario";
import type { ItemLocado } from "./ItemLocado";

export class Locacao {
  constructor(
    public codigo: Number = 0,
    public dataHoraLocacao: string = "",
    public horasContratadas: number = 0,
    public dataHoraEntregaPrevista: string = "",
    public desconto: number = 0,
    public valorTotal: number = 0,
    public cliente: Cliente = new Cliente(),
    public registradoPor: Funcionario = new Funcionario(),
    public itens: Array<ItemLocado> = []
  ) {}
}