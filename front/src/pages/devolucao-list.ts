import { VisaoDevolucaoEmHTML } from "../visao/visao-devolucao-html";

export function initDevolucaoList() {
  const addButton = document.getElementById("addButton");
  new VisaoDevolucaoEmHTML();

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
