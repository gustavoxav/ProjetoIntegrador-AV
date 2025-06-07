import { ControladoraLocacao } from "../locacao/controladora-locacao";
import { VisaoLocacaoEmHTML } from "../locacao/visao-locacao-html";

export function initLocacaoList() {
  const addButton = document.getElementById("addButton");
  new ControladoraLocacao(new VisaoLocacaoEmHTML());

  if (addButton) {
    addButton.addEventListener("click", () => {
      window.history.pushState({}, "", "/locacao-add");
      window.dispatchEvent(
        new CustomEvent("routeChange", {
          detail: { path: "/locacao-add" },
        })
      );
    });
  }
}
