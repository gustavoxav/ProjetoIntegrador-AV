import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import dotenv from "dotenv";
import { navegarPara } from "../../src/infra/utils";

dotenv.config();

export class RelatorioItens {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.waitForTimeout(1000);
    await this.page.goto(apiUrl);
    await this.page.waitForTimeout(1000);
    await navegarPara("#opt-relatorio-itens", "relatorio-itens-alugados", this.page);
  }

  async verificarCamposObrigatorios() {
    await this.page.waitForSelector('#start-date', { timeout: 5000 });
    await this.page.waitForSelector('#end-date', { timeout: 5000 });
    await this.page.waitForSelector('#btn-buscar-relatorio', { timeout: 5000 });
  }

  async verificarInputsDataMesAtual(): Promise<boolean> {
    try {
      await this.page.waitForSelector('#start-date', { timeout: 5000 });
      await this.page.waitForSelector('#end-date', { timeout: 5000 });
      
      await this.page.waitForFunction(() => {
        const startInput = document.getElementById('start-date') as HTMLInputElement;
        const endInput = document.getElementById('end-date') as HTMLInputElement;
        return startInput && endInput && startInput.value !== '' && endInput.value !== '';
      }, { timeout: 10000 });
      
      const startDateValue = await this.page.inputValue('#start-date');
      const endDateValue = await this.page.inputValue('#end-date');
      
      const hoje = new Date();
      const anoAtual = hoje.getFullYear();
      const mesAtual = hoje.getMonth();      
      const primeiroDiaMes = new Date(anoAtual, mesAtual, 1);
      const ultimoDiaMes = new Date(anoAtual, mesAtual + 1, 0);
      
      const primeiroDiaFormatado = primeiroDiaMes.toISOString().split('T')[0];
      const ultimoDiaFormatado = ultimoDiaMes.toISOString().split('T')[0];
      
      return startDateValue === primeiroDiaFormatado && endDateValue === ultimoDiaFormatado;
      
    } catch (error) {
      console.error('Erro ao verificar inputs de data:', error);
      return false;
    }
  }

  async obterValorInputInicio(): Promise<string> {
    await this.page.waitForSelector('#start-date', { timeout: 5000 });
      
    await this.page.waitForFunction(() => {
      const startInput = document.getElementById('start-date') as HTMLInputElement;
      return startInput && startInput.value !== '';
    }, { timeout: 10000 });
      
    const startDateValue = await this.page.inputValue('#start-date');
    return startDateValue;
  }

  async obterValorInputFim(): Promise<string> {
    await this.page.waitForSelector('#end-date', { timeout: 5000 });
      
    await this.page.waitForFunction(() => {
      const endInput = document.getElementById('end-date') as HTMLInputElement;
      return endInput && endInput.value !== '';
    }, { timeout: 10000 });
      
    const endDateValue = await this.page.inputValue('#end-date');
    return endDateValue;
  }

  async verificarInputInicioMesAtual(): Promise<boolean> {
    try {
      const startDateValue = await this.obterValorInputInicio();
      
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const primeiroDiaFormatado = primeiroDiaMes.toISOString().split('T')[0];
      
      return startDateValue === primeiroDiaFormatado;
    } catch (error) {
      return false;
    }
  }

  async verificarInputFimMesAtual(): Promise<boolean> {
    try {
      const endDateValue = await this.obterValorInputFim();
      
      const hoje = new Date();
      const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      const ultimoDiaFormatado = ultimoDiaMes.toISOString().split('T')[0];
      
      return endDateValue === ultimoDiaFormatado;
    } catch (error) {
      return false;
    }
  }

  async verificarResumoRelatorio(): Promise<boolean> {
    await this.page.waitForSelector('#resumo-relatorio', { timeout: 5000 });
    return await this.page.isVisible('#resumo-relatorio');
  }

  async preencherDatasEBuscar(dataInicio: string, dataFim: string): Promise<void> {
    await this.page.waitForSelector('#start-date', { timeout: 5000 });
    await this.page.waitForSelector('#end-date', { timeout: 5000 });
    await this.page.waitForSelector('#btn-buscar-relatorio', { timeout: 5000 });

    await this.page.fill('#start-date', '');
    await this.page.fill('#end-date', '');
    
    const [diaInicio, mesInicio, anoInicio] = dataInicio.split('/');
    
    await this.page.click('#start-date');
    await this.page.type('#start-date', diaInicio, { delay: 300 });
    await this.page.waitForTimeout(300);
    await this.page.type('#start-date', mesInicio, { delay: 300 });
    await this.page.waitForTimeout(300);
    await this.page.type('#start-date', anoInicio, { delay: 300 });

    const [diaFim, mesFim, anoFim] = dataFim.split('/');

    await this.page.click('#end-date');
    await this.page.type('#end-date', diaFim, { delay: 300 });
    await this.page.waitForTimeout(300);
    await this.page.type('#end-date', mesFim, { delay: 300 });
    await this.page.waitForTimeout(300);
    await this.page.type('#end-date', anoFim, { delay: 300 });

    await this.page.waitForTimeout(500);

    await this.page.click('#btn-buscar-relatorio');

    await this.page.waitForTimeout(3000);
  }

  async verificarGraficoExiste(): Promise<boolean> {
    try {
      await this.page.waitForSelector('#grafico-itens-alugados', { timeout: 10000 });
      
      const canvas = await this.page.locator('#grafico-itens-alugados');
      const isVisible = await canvas.isVisible();
      
      if (!isVisible) return false;
      
      const canvasWidth = await canvas.getAttribute('width');
      const canvasHeight = await canvas.getAttribute('height');
      
      return canvasWidth !== null && canvasHeight !== null && 
      parseInt(canvasWidth) > 0 && parseInt(canvasHeight) > 0;
    } catch (error) {
      console.error('Erro ao verificar gráfico:', error);
      return false;
    }
  }

  async obterValorTotalGeral(): Promise<string> {
    try {
      await this.page.waitForSelector('#resumo-total-geral', { timeout: 10000 });
      const valorTexto = await this.page.textContent('#resumo-total-geral');
      return valorTexto?.trim() || '';
    } catch (error) {
      console.error('Erro ao obter valor total geral:', error);
      return '';
    }
  }

  async verificarValorTotalGeral(valorEsperado: string): Promise<boolean> {
    try {
      const valorAtual = await this.obterValorTotalGeral();
      console.log(`Valor total esperado: ${valorEsperado}, atual: ${valorAtual}`);
      return valorAtual === valorEsperado;
    } catch (error) {
      console.error('Erro ao verificar valor total geral:', error);
      return false;
    }
  }

  async criarRelatorioComDatasCustomizadas(dataInicio: string, dataFim: string, valorEsperado: string): Promise<boolean> {
    try {
      await this.preencherDatasEBuscar(dataInicio, dataFim);
      
      await this.page.waitForTimeout(2000);
      
      const graficoExiste = await this.verificarGraficoExiste();
      if (!graficoExiste) {
        console.error('Gráfico não foi encontrado');
        return false;
      }
      
      await this.page.waitForTimeout(2000);
      
      const valorCorreto = await this.verificarValorTotalGeral(valorEsperado);
      if (!valorCorreto) {
        console.error(`Valor total geral não confere. Esperado: ${valorEsperado}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao criar relatório com datas customizadas:', error);
      return false;
    }
  }
}