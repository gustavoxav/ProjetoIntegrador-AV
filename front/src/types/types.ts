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
  cpf?: string;
  cargo?: string;
};

export type Equipamento = {
  codigo: number;
  modelo: string;
  fabricante: string;
  descricao: string;
  valorCompra: number;
  valorHora: number;
  avarias: string;
  disponivel: boolean;
  numeroSeguro: string;
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

export type DadosAvaria = {
  avaliadorId: number;
  descricao: string;
  valorCobrar: number;
  equipamentoId: number;
  locacaoId?: number;
  foto: File;
};

export type DadosAvariaVisao = {
  avaliadorId: number;
  descricao: string;
  valorCobrar: number;
  equipamento: { codigo: number; valorOriginal: number } | null;
  locacaoId?: number;
  foto: File;
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
  valorPago: number;
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

export type DadosLogin = {
  cpf: string;
  senha: string;
};

export type DadosResgitroAvaria = {
  codigo: number;
  descricao: string;
  registradoPor: Funcionario;
};

export type DevolucaoComFuncionario = RespostaSimulacaoDevolucao & {
  registradoPor: Funcionario;
};

export type RespostaRelatorioDevolucao = {
  relatorio: {
    periodo: {
      dataInicial: string;
      dataFinal: string;
      dataInicialFormatada: string;
      dataFinalFormatada: string;
    };
    resumo: {
      valorTotalGeral: number;
      quantidadeLocacoesGeral: number;
      quantidadeDias: number;
    };
    dados: {
      data: string;
      dataFormatada: string;
      valorTotalPago: number;
      quantidadeLocacoes: number;
    }[];
  };
};

export type RespostaRelatorioEquipamento = {
  relatorio: {
    periodo: {
      dataInicial: string;
      dataFinal: string;
      dataInicialFormatada: string;
      dataFinalFormatada: string;
    };
    resumo: {
      totalLocacoesPeriodo: number;
      totalItensUnicos: number;
      quantidadeTop10: number;
      quantidadeOutros: number;
    };
    ranking: {
      posicao: number;
      equipamentoId: number;
      modelo: string;
      fabricante: string;
      descricao: string;
      tipo: string;
      quantidadeLocacoes: number;
      percentual: number;
    }[];
    grafico: {
      label: string;
      valor: number;
      percentual: number;
    }[];
  };
};
