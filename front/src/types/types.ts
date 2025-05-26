export type Cliente = {
  codigo: number;
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  foto: string;
};

export type Funcionario = {
  codigo: number;
  nome: string;
};

export type Equipamento = {
  codigo: number;
  modelo: string;
  fabricante: string;
  descricao: string;
  valorHora: number; // TODO: arrumar no back -> em algumas rotas vem como string e em outras como number
  avarias: string;
  disponivel: boolean;
  numeroSeguro: number; // TODO: arrumar no back - era pra ser string
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
  registradoPor: Funcionario;
  itens: Array<{
    codigo: number;
    tempoContratado: number;
    subtotal: number;
    equipamento: Equipamento;
  }>;
};

export type DadosLocacao = {
  cliente: {
    codigo: number;
  };
  registradoPor: {
    codigo: number;
  };
  horasContratadas: number;
  itens: Array<{
    equipamento: Equipamento;
  }>;
};

export type DadosDevolucao = {
  locacaoId: number;
  registradoPor: Funcionario;
  dataHoraDevolucao: string;
  valorPago: number;
};

export type RespostaDevolucao = {
  codigo: number;
  dataHoraDevolucao: string;
  valorPago: string; // TODO: tá vindo como string
  locacao: {
    codigo: number;
    dataHoraLocacao: string;
    horasContratadas: number;
    dataHoraEntregaPrevista: string;
    cliente: {
      codigo: number;
      nomeCompleto: string;
      cpf: string;
    };
  };
  registradoPor: Funcionario;
};

export type RespostaSimulacaoDevolucao = {
  locacao: {
    codigo: number;
    dataHoraLocacao: string;
    horasContratadas: number;
    dataHoraEntregaPrevista: string;
    desconto: number;
    valorTotal: number;
    cliente: {
      codigo: number;
      nomeCompleto: string;
      telefone: string;
    };
    registradoPor: Funcionario;
    itens: {
      codigo: number;
      tempoContratado: number;
      subtotal: number;
      equipamento: Equipamento;
    }[];
  };
  dataHoraDevolucao: string;
  valorPago: number;
};
