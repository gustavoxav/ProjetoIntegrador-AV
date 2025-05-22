import { VisaoDevolucaoEmHTML } from "../visao/visao-devolucao-html";
import { VisaoFuncionarioEmHTML } from "../visao/visao-funcionario-html";

export function initDevolucaoAdd() {
  console.log("Devolucao add page initialized");

  new VisaoDevolucaoEmHTML();
  new VisaoFuncionarioEmHTML();

  const urlParams = new URLSearchParams(window.location.search);
  const codigo = urlParams.get("codigo");
  console.log("Código da locação:", codigo);

  if (codigo) {
    const input = document.getElementById(
      "input-buscar-locacao"
    ) as HTMLElement;
    input.setAttribute("value", codigo);
  }
}
