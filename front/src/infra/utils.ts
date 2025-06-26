export async function navegarPara(
  seletor: string,
  urlEsperada: string,
  page: any
) {
  await page.locator(seletor).click();
  await page.waitForURL(`**/${urlEsperada}`);
}

export function formatarDataHora(isoString: string): string {
  const data = new Date(isoString);
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear();
  const hora = data.getHours().toString().padStart(2, "0");
  const minuto = data.getMinutes().toString().padStart(2, "0");
  return `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
}

export function calcularHorasUtilizadas(
  dataHoraLocacao: string,
  dataHoraDevolucao: string
): { horasTotais: number; horas: number; minutos: number } {
  const inicio = new Date(dataHoraLocacao);
  const fim = new Date(dataHoraDevolucao);

  const diferencaMs = fim.getTime() - inicio.getTime();
  const totalMinutos = Math.floor(diferencaMs / 60000);

  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  const horasTotais = +(totalMinutos / 60).toFixed(2);

  return { horasTotais, horas, minutos };
}

export function calcularHorasCobranca(
  dataHoraLocacao: string,
  dataHoraDevolucao: string
): number {
  const inicio = new Date(dataHoraLocacao);
  const fim = new Date(dataHoraDevolucao);

  const diferencaMs = fim.getTime() - inicio.getTime();
  const totalMinutos = Math.floor(diferencaMs / 60000);

  const horasCompletas = Math.floor(totalMinutos / 60);
  const minutosExcedentes = totalMinutos % 60;

  return minutosExcedentes > 0 ? horasCompletas + 1 : horasCompletas;
}

export function formatarData(dataISO: string): string {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR");
}
