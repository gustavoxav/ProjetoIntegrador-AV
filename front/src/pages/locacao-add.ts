import { ControladoraLocacao } from "../controladora/controladora-locacao.js";
import { VisaoClienteEmHTML } from "../visao/visao-cliente-html.js";
import { VisaoEquipamentoEmHTML } from "../visao/visao-equipamento-html.js";
import { VisaoFuncionarioEmHTML } from "../visao/visao-funcionario-html.js";
import { VisaoLocacaoEmHTML } from "../visao/visao-locacao-html.js";

export function initLocacaoAdd() {

  const controladoraLocacao = new ControladoraLocacao(
    new VisaoLocacaoEmHTML(),
    new VisaoClienteEmHTML(),
    new VisaoFuncionarioEmHTML(),
    new VisaoEquipamentoEmHTML()
  );
  
  const output = document.querySelector("output");
  if (output) output.innerHTML = "";
  const form = document.querySelector("form");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      return false;
    };
  }

  const salvarButton = document.getElementById("salvar");
  if (salvarButton) {
    const newButton = salvarButton.cloneNode(true);
    salvarButton.parentNode?.replaceChild(newButton, salvarButton);

    newButton.addEventListener("click", (e) => {
      e.preventDefault();
      controladoraLocacao.registrarLocacao();
      return false;
    });
  }

  document.getElementById("equipamento")?.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    if (input.value) {
      const equipamentoId = input.value;
      const tabela = document.getElementById("tabela-equipamentos");
      if (tabela) {
        tabela.setAttribute("data-ultimo-equipamento", equipamentoId);
      }
    }
  });
}
