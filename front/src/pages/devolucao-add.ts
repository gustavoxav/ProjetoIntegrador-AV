import { ControladoraDevolucao } from "../controladora/controladora-devolucao";
import { VisaoDevolucaoEmHTML } from "../visao/visao-devolucao-html";
import { VisaoEquipamentoEmHTML } from "../visao/visao-equipamento-html";
import { VisaoFuncionarioEmHTML } from "../visao/visao-funcionario-html";

export function initDevolucaoAdd() {
  console.log("Devolucao add page initialized");

  const visaoDevolucao = new VisaoDevolucaoEmHTML();
  const visaoFuncionario = new VisaoFuncionarioEmHTML();
  const visaoEquipamento = new VisaoEquipamentoEmHTML();

  const controladora = new ControladoraDevolucao(
    visaoDevolucao,
    visaoFuncionario,
    visaoEquipamento
  );

  const salvarButton = document.getElementById("salvar-devolucao");
  if (salvarButton) {
    const newButton = salvarButton.cloneNode(true);
    salvarButton.parentNode?.replaceChild(newButton, salvarButton);

    newButton.addEventListener("click", (e) => {
      e.preventDefault();
      controladora.registrarDevolucao();
      return false;
    });
  }

  document
    .getElementById("btn-buscar-locacoes")
    ?.addEventListener("click", () => controladora.buscarLocacoes());

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
