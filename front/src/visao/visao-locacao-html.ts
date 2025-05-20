import type { VisaoLocacao } from "./visao-locacao.js";
import { ControladoraLocacao } from "../controladora/controladora-locacao.js";

export class VisaoLocacaoEmHTML implements VisaoLocacao {
    private controladora: ControladoraLocacao;
    private isSubmitting = false;
    
    constructor() {
        this.controladora = new ControladoraLocacao(this);
    }
    
    public async salvar(): Promise<void> {
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        
        try {
            await this.controladora.registrarLocacao();
        } finally {
            setTimeout(() => {
                this.isSubmitting = false;
            }, 1000);
        }
    }

    obterDadosLocacao() {
        const funcionario = (document.querySelector('input[name="funcionario"]:checked') as HTMLInputElement)?.value || '';
        const cliente = (document.getElementById('cliente') as HTMLInputElement)?.value || '';
        const horas = Number((document.getElementById('hora') as HTMLInputElement)?.value) || 0;
        
        const equipamentos = this.obterEquipamentos();
        console.log(`Equips selecionados: ${equipamentos.length}`, equipamentos);

        return {
            funcionario,
            cliente,
            horas,
            equipamentos,
            subtotal: document.getElementById('subtotal-itens')?.textContent || '0,00',
            desconto: document.getElementById('desconto')?.textContent || '0,00',
            valorTotal: document.getElementById('valor-total')?.textContent || '0,00',
            dataLocacao: document.getElementById('data-locacao')?.textContent || '-',
            dataDevolucao: document.getElementById('data-devolucao')?.textContent || '-'
        };
    }

    private obterEquipamentos(): Array<{codigo: number, descricao: string, valor: number}> {
        type EquipamentoTemp = {codigo: number, descricao: string, valor: number};
        const equipamentos: EquipamentoTemp[] = [];
        
        console.log("Buscando equipamentos na tabela");
        
        const tabela = document.getElementById('tabela-equipamentos');
        console.log("Tabela de equipamentos encontrada?", !!tabela);
        
        if (tabela) {
            const linhas = tabela.querySelectorAll('tbody tr');
            console.log(`Encontradas ${linhas.length} linhas na tabela de equipamentos`);
            
            for (const linha of Array.from(linhas)) {
                if (linha.querySelector('th') || linha.querySelector('td[colspan]')) {
                    continue;
                }
                
                try {
                    const colunas = linha.querySelectorAll('td');
                    if (colunas.length >= 2) {
                        const descricao = colunas[0].textContent?.trim() || '';
                        
                        const valorTexto = colunas[1].textContent || '';
                        const valorMatch = valorTexto.match(/R\$ ([\d.,]+)/);
                        const valor = valorMatch ? Number(valorMatch[1].replace(',', '.')) : 0;
                        
                        const codigo = Number(linha.getAttribute('equip-codigo')) || 0;
                        
                        console.log(`Processando linha: "${descricao}" -> código ${codigo}, valor ${valor}`);
                        
                        if (codigo > 0) {
                            equipamentos.push({
                                codigo,
                                descricao,
                                valor
                            });
                            console.log(`Equipamento adicionado: ${descricao} (código ${codigo})`);
                        }
                    }
                } catch (err) {
                    console.error("Erro ao processar linha:", err);
                }
            }
        }
        
        if (equipamentos.length === 0) {
            console.log("Tentando encontrar equipamentos na lista de selecionados");
            
            const lista = document.getElementById('equipamentos-selecionados-lista');
            if (lista) {
                const itens = lista.querySelectorAll('li:not(.text-muted)');
                console.log(`Encontrados ${itens.length} itens na lista de selecionados`);
                
                for (const item of Array.from(itens)) {
                    try {
                        const texto = item.textContent || '';
                        const descricao = texto.split(' - R$')[0].trim();
                        
                        const valorMatch = texto.match(/R\$ ([\d.,]+)\/h/);
                        const valor = valorMatch ? Number(valorMatch[1].replace(',', '.')) : 0;
                        
                        const codigo = Number(item.getAttribute('equip-codigo')) || 0;
                        
                        console.log(`Processando item da lista: "${descricao}" -> código ${codigo}`);
                        
                        if (codigo > 0) {
                            equipamentos.push({
                                codigo,
                                descricao,
                                valor
                            });
                            console.log(`Equipamento adicionado da lista: ${descricao} (código ${codigo})`);
                        }
                    } catch (err) {
                        console.error("Erro ao processar item da lista:", err);
                    }
                }
            }
        }
        
        console.log(`Total de equipamentos capturados: ${equipamentos.length}`, equipamentos);
        return equipamentos;
    }
    
    exibirMensagemSucesso(x: string): void {
        const output = document.querySelector('output');
        if (output) {
            output.className = 'alert alert-success mt-3 d-block';
            output.textContent = x;
        }
    }
    
    exibirMensagemErro(x: string): void {
        const output = document.querySelector('output');
        if (output) {
            output.className = 'alert alert-danger mt-3 d-block';
            output.textContent = x;
        }
    }
} 