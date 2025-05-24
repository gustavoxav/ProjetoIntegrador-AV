import { ControladoraDevolucao } from "../controladora/controladora-devolucao";
import { VisaoDevolucaoEmHTML } from "../visao/visao-devolucao-html";
import { VisaoEquipamentoEmHTML } from "../visao/visao-equipamento-html";
import { VisaoFuncionarioEmHTML } from "../visao/visao-funcionario-html";

export function initDevolucaoAdd() {
  const controladora = new ControladoraDevolucao(
    new VisaoDevolucaoEmHTML(),
    new VisaoFuncionarioEmHTML(),
    new VisaoEquipamentoEmHTML()
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

  if (codigo) {
    const input = document.getElementById(
      "input-buscar-locacao"
    ) as HTMLElement;
    input.setAttribute("value", codigo);
  }
}
