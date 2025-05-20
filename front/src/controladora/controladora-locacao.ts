import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorLocacao } from "../gestor/gestor-locacao.js";
import type { VisaoLocacao } from "../visao/visao-locacao.js";

export class ControladoraLocacao {
  private gestor: GestorLocacao;

  constructor(private visao: VisaoLocacao) {
    this.gestor = new GestorLocacao();
  }

  public async registrarLocacao(): Promise<void> {
    try {
      const dadosLocacao = this.visao.obterDadosLocacao();
      console.log("Dados locação obtidos:", dadosLocacao);
      
      if (!dadosLocacao.cliente) {
        this.visao.exibirMensagemErro("Informe o código ou CPF do cliente");
        return;
      }
      
      if (!dadosLocacao.funcionario) {
        this.visao.exibirMensagemErro("Selecione um funcionário responsável pela locação");
        return;
      }
      
      if (!Array.isArray(dadosLocacao.equipamentos)) {
        console.error("Equipamentos não é um array:", dadosLocacao.equipamentos);
        this.visao.exibirMensagemErro("Erro ao processar equipamentos. Tente novamente.");
        return;
      }
      
      if (dadosLocacao.equipamentos.length === 0) {
        console.error("Nenhum equipamento foi selecionado");
        this.visao.exibirMensagemErro("Selecione pelo menos um equipamento para a locação");
        return;
      }
      
      console.log(`Encontrados ${dadosLocacao.equipamentos.length} equipamentos:`, 
        dadosLocacao.equipamentos.map(e => `${e.descricao} (${e.codigo})`));
      
      const equipamentosInvalidos = dadosLocacao.equipamentos.filter(e => !e.codigo);
      if (equipamentosInvalidos.length > 0) {
        console.error("Equipamentos inválidos:", equipamentosInvalidos);
        this.visao.exibirMensagemErro("Há equipamentos inválidos na locação");
        return;
      }
      
      const dadosFormatados = {
        cliente: {
          codigo: Number(dadosLocacao.cliente)
        },
        registradoPor: {
          codigo: Number(dadosLocacao.funcionario)
        },
        horasContratadas: dadosLocacao.horas,
        itens: dadosLocacao.equipamentos.map(eq => ({
          equipamento: {
            codigo: eq.codigo,
            descricao: eq.descricao,
            valorHora: eq.valor,
            disponivel: true
          }
        }))
      };
      
      console.log("Enviando para API:", 
        JSON.stringify({
          cliente: dadosFormatados.cliente,
          registradoPor: dadosFormatados.registradoPor,
          horasContratadas: dadosFormatados.horasContratadas,
          itens: dadosFormatados.itens.map(i => ({ 
            equipamento: { 
              codigo: i.equipamento.codigo,
              descricao: i.equipamento.descricao
            } 
          }))
        }, null, 2)
      );
      
      if (!dadosFormatados.cliente.codigo) {
        this.visao.exibirMensagemErro("Informe um cliente válido");
        return;
      }
      
      if (!dadosFormatados.registradoPor.codigo) {
        this.visao.exibirMensagemErro("Selecione um funcionário responsável");
        return;
      }
      
      try {
        const resultado = await this.gestor.registrarLocacao(dadosFormatados);
        console.log("Cadastro realizado com sucesso:", resultado);
        
        this.visao.exibirMensagemSucesso("Locação registrada com sucesso!");
        
        window.location.href = "/";
      } catch (apiError) {
        console.error("Erro na API:", apiError);
        if (apiError instanceof ErroDominio) {
          this.visao.exibirMensagemErro(apiError.getProblemas()[0]);
        } else {
          this.visao.exibirMensagemErro("Erro ao processar requisição");
        }
      }
    } catch (error: unknown) {
      console.error("Erro ao processar locação:", error);
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        const errorMessage = error instanceof Error ? error.message : "Erro ao registrar locação";
        this.visao.exibirMensagemErro(errorMessage);
      }
    }
  }

    public async buscarLocacoes() {
      const gestor = new GestorLocacao();
      try {
        const response = await gestor.obterLocacoes();
        this.visao.exibirListagemLocacao(response);
      } catch (error: any) {
        if (error instanceof ErroDominio) {
          this.visao.exibirMensagemErro(error.getProblemas()[0]);
        } else {
          this.visao.exibirMensagemErro(error.message);
        }
      }
    }
} 


