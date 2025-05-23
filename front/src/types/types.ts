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

export type Funcionario = {
  codigo: number;
  nome: string;
}

type EquipamentoResumo = {
  codigo: number;
  descricao: string;
  valorHora: number;
  disponivel: boolean;
};

export type RespostaLocacao = {
  codigo: number;
  dataHoraLocacao: string;
  horasContratadas: number;
  dataHoraEntregaPrevista: string;
  desconto: number;
  valorTotal: number;
  devolvida: boolean;
  cliente: {
    codigo: number;
    nomeCompleto: string;
    telefone: string;
  };
  registradoPor: {
    codigo: number;
    nome: string;
  };
  itens: Array<{
    codigo: number;
    tempoContratado: number;
    subtotal: number;
    equipamento: EquipamentoResumo;
  }>;
}

export type DadosLocacao = {
  cliente: {
    codigo: number;
  };
  registradoPor: {
    codigo: number;
  };
  horasContratadas: number;
  itens: Array<{
    equipamento: EquipamentoResumo;
  }>;
}

export type DadosDevolucao = {
  locacao: {
    codigo: number;
  };
  registradoPor: {
    codigo: number;
  };
}

export type RespostaDevolucao = {
  codigo: number;
  dataHoraLocacao: string;
  horasContratadas: number;
  dataHoraEntregaPrevista: string;
  desconto: number;
  valorTotal: number;
  cliente: {
    codigo: number;
    nomeCompleto: string;
  };
  registradoPor: {
    codigo: number;
    nome: string;
  };
  locacao: {
    codigo: number;
  }
}