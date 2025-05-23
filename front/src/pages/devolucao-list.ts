import { ControladoraDevolucao } from "../controladora/controladora-devolucao";
import { VisaoDevolucaoEmHTML } from "../visao/visao-devolucao-html";

export function initDevolucaoList() {
  const addButton = document.getElementById("addButton");
  const visaoDevolucao = new VisaoDevolucaoEmHTML();
  new ControladoraDevolucao(visaoDevolucao);

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
