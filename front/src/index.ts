import page from "page";
import { VisaoLocacaoEmHTML } from "./locacao/visao-locacao-html";
import { VisaoDevolucaoEmHTML } from "./devolucao/visao-devolucao-html";
import { VisaoFuncionarioEmHTML } from "./funcionario/visao-funcionario-html";
import { VisaoEquipamentoEmHTML } from "./equipamento/visao-equipamento-html";
import { AuthMiddleware } from "./infra/AuthMiddleware";
import { ControladoraFuncionario } from "./funcionario/controladora-funcionario";

function gerarMenuPorCargo(cargo: string) {
  const links: { href: string; texto: string; id: string }[] = [
    {
      href: "/locacao-list",
      texto: "Listagem locações",
      id: "opt-list-locacao",
    },
    {
      href: "/devolucao-list",
      texto: "Listagem devolução",
      id: "opt-list-devolucao",
    },
  ];
  if (cargo === "Gerente" || cargo === "Atendente") {
    links.push(
      { href: "/locacao-add", texto: "Nova locação", id: "opt-nova-locacao" },
      {
        href: "/devolucao-add",
        texto: "Nova devolução",
        id: "opt-nova-devolucao",
      },
      {
        href: "/relatorio-itens",
        texto: "Relatório Itens Alugados",
        id: "opt-relatorio-itens",
      }
    );
  }
  if (cargo === "Gerente") {
    links.push({
      href: "/relatorio-devolucoes",
      texto: "Relatório Devoluções",
      id: "opt-relatorio-devolucoes",
    });
  }

  const ul = document.getElementById("navbar-links");
  if (!ul) return;
  ul.innerHTML = "";

  links.forEach(({ href, texto, id }) => {
    const li = document.createElement("li");
    li.className = "nav-item";

    const a = document.createElement("a");
    a.className = "nav-link";
    a.href = href;
    a.id = id;
    a.setAttribute("data-route", "");
    a.textContent = texto;
    li.appendChild(a);
    ul.appendChild(li);
  });
}

function carregadorElemento(section: HTMLElement | null, url: string) {
  if (!section) return;
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      section.innerHTML = html;
    })
    .catch((err) => {
      console.error("Erro ao carregar sessão", section, err);
    });
}

function carregarRota(htmlPath: string, initFn: () => void) {
  const controladora = new ControladoraFuncionario(
    new VisaoFuncionarioEmHTML()
  );

  if (!controladora.isRotaAllowed()) {
    window.location.href = "/locacao-list";
    return;
  }
  const mainContainer = document.getElementById("main-controller");
  carregadorElemento(mainContainer, htmlPath);
  setTimeout(() => {
    initFn();
  }, 50);
}

function configurarEventosNavbar() {
  setTimeout(() => {
    const controladora = new ControladoraFuncionario(
      new VisaoFuncionarioEmHTML()
    );
    const cargo = controladora.obterFuncionarioLogado()?.cargo;
    if (cargo) gerarMenuPorCargo(cargo);

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
      btnLogout.addEventListener("click", async (e) => {
        e.preventDefault();
        const controladora = new ControladoraFuncionario(
          new VisaoFuncionarioEmHTML()
        );
        await controladora.logout();
      });
    }
  }, 100);
}

function carregarNomeUsuario() {
  setTimeout(() => {
    const usuarioLogadoElement = document.getElementById("usuario-logado");

    if (usuarioLogadoElement) {
      const controladora = new ControladoraFuncionario(
        new VisaoFuncionarioEmHTML()
      );
      const nomeECargoFormatado =
        controladora.obterNomeECargoFuncionarioLogado();
      usuarioLogadoElement.textContent = nomeECargoFormatado;
    }
  }, 100);
}

document.addEventListener("DOMContentLoaded", () => {
  carregadorElemento(
    document.getElementById("navbar-container"),
    "/components/navbar.html"
  );
  carregadorElemento(
    document.getElementById("footer-container"),
    "/components/footer.html"
  );

  configurarEventosNavbar();

  // Rota de login - se tem cookie vai para /locacao-list, se não fica no login
  page("/", AuthMiddleware.controleLogin, () =>
    carregarRota("/pages/login.html", () => {
      new VisaoFuncionarioEmHTML().iniciarLogin();
    })
  );

  // Rotas protegidas - se não tem cookie vai para /
  page("/locacao-list", AuthMiddleware.protegerRota, () =>
    carregarRota("/pages/locacao-list.html", () => {
      new VisaoLocacaoEmHTML().iniciarList();
      carregarNomeUsuario();
    })
  );
  page("/locacao-add", AuthMiddleware.protegerRota, () =>
    carregarRota("/pages/locacao-add.html", () => {
      new VisaoLocacaoEmHTML().iniciarAdd();
      carregarNomeUsuario();
    })
  );
  page("/devolucao-list", AuthMiddleware.protegerRota, () =>
    carregarRota("/pages/devolucao-list.html", () => {
      new VisaoDevolucaoEmHTML().iniciarList();
      carregarNomeUsuario();
    })
  );
  page("/devolucao-add", AuthMiddleware.protegerRota, () =>
    carregarRota("/pages/devolucao-add.html", () => {
      new VisaoDevolucaoEmHTML().iniciarAdd();
      carregarNomeUsuario();
    })
  );
  page("/avaria-add", AuthMiddleware.protegerRota, () =>
    carregarRota("/pages/avarias-add.html", () => {
      new VisaoEquipamentoEmHTML().iniciarAdd();
      carregarNomeUsuario();
    })
  );

  // Rota alternativa de login
  page("/login", AuthMiddleware.controleLogin, () =>
    carregarRota("/pages/login.html", () => {
      new VisaoFuncionarioEmHTML().iniciarLogin();
    })
  );
  page("*", () => carregarRota("/pages/not-found.html", () => {}));

  page();
});
