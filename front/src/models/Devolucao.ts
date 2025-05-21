export class Devolucao {
  constructor(
    public codigo: Number = 0,
    public dataHoraDevolucao: string = "",
    public codigoLocacao: number = 0,
    public nomeCliente: string = "",
    public valorPago: number = 0,
  ) {}
}