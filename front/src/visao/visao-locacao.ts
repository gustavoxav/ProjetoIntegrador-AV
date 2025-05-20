export interface VisaoLocacao {
    obterDadosLocacao(): {
        funcionario: string;
        cliente: string;
        horas: number;
        equipamentos: Array<{
            codigo: number;
            descricao: string;
            valor: number;
        }>;
        subtotal: string;
        desconto: string;
        valorTotal: string;
        dataLocacao: string;
        dataDevolucao: string;
    };
    
    salvar(): Promise<void>;
    exibirMensagemSucesso(x: string): void;
    exibirMensagemErro(x: string): void;
}