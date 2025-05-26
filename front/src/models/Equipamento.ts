export class Equipamento {
  constructor(
    public codigo: number = 0,
    public modelo: string = "",
    public fabricante: string = "",
    public descricao: string = "",
    public valorHora: number = 0.0,
    public avarias: string = "",
    public disponivel: boolean = true,
    public numeroSeguro: number = 0
  ) {}
}