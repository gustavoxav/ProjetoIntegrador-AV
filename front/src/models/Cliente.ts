export class Cliente {
  constructor(
    public codigo: Number = 0,
    public nomeCompleto: string = "",
    public dataNascimento: string = "",
    public cpf: string = "",
    public telefone: string = "",
    public email: string = "",
    public endereco: string = "",
    public foto: string = ""
  ) {}
}
