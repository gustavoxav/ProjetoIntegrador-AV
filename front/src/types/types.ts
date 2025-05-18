export type Cliente = {
    codigo: number;
    nomeCompleto: string;
    dataNascimento: string;
    cpf: string;
    telefone: string;
    email: string;
    endereco: string;
    foto: string;
}

export type Equipamento = {
    codigo: number;
    modelo: string;
    fabricante: string;
    descricao: string;
    valorHora: number;
    avarias: string;
    disponivel: boolean;
    seguro: number;
}