import { ControladoraDevolucao } from "../devolucao/controladora-devolucao";
import { VisaoDevolucaoEmHTML } from "../devolucao/visao-devolucao-html";

export function initDevolucaoList() {
  const addButton = document.getElementById("addButton");
  new ControladoraDevolucao(new VisaoDevolucaoEmHTML());

  if (addButton) {
    addButton.addEventListener("click", () => {
      window.history.pushState({}, "", "/devolucao-add");
      window.dispatchEvent(
        new CustomEvent("routeChange", {
          detail: { path: "/devolucao-add" },
        })
      );
    });
  }
}
