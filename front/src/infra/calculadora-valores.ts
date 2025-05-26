import type { Equipamento } from "../types/types.js";

export interface ResultadoCalculo {
  subtotal: number;
  desconto: number;
  valorTotal: number;
  temDesconto: boolean;
}

/**
 * Calcula os valores baseados nas horas fornecidas
 * @param equipamentos Lista de equipamentos
 * @param horas Horas
 * @returns Resultado do cálculo com subtotal, desconto e valor total
 */
export function calcularValores(equipamentos: Equipamento[], horas: number): ResultadoCalculo {
  let subtotal = 0;
  for (const equipamento of equipamentos) {
    subtotal += equipamento.valorHora * horas;
  }

  const temDesconto = horas > 2;
  const desconto = temDesconto ? subtotal * 0.1 : 0;
  const valorTotal = subtotal - desconto;

  return {
    subtotal,
    desconto,
    valorTotal,
    temDesconto
  };
}

/**
 * Calcula o valor individual de um equipamento baseado nas horas
 * @param equipamento Equipamento para calcular
 * @param horas Horas
 * @returns Objeto com valor total e desconto individual
 */
export function calcularValorIndividual(equipamento: Equipamento, horas: number): { valorTotal: number; desconto: number; temDesconto: boolean } {
  const temDesconto = horas > 2;
  const valorTotal = equipamento.valorHora * horas;
  const desconto = temDesconto ? valorTotal * 0.1 : 0;

  return {
    valorTotal,
    desconto,
    temDesconto
  };
}

/**
 * Formata um valor
 * @param valor Valor a ser formatado
 * @returns String formatada (ex: "12,50")
 */
export function formatarValor(valor: number | undefined | null): string {
  if (typeof valor !== "number" || Number.isNaN(valor)) {
    return "0,00";
  }

  return valor.toFixed(2).replace(".", ",");
}

/**
 * Formata um valor com R$
 * @param valor Valor a ser formatado
 * @returns String formatada (ex: "R$ 12,50")
 */
export function formatarValorComSimbolo(valor: number | undefined | null): string {
  return `R$ ${formatarValor(valor)}`;
} 