import { VisaoClienteEmHTML } from "../visao/visao-cliente-html.js";
import { VisaoEquipamentoEmHTML } from "../visao/visao-equipamento-html.js";
import { VisaoFuncionarioEmHTML } from "../visao/visao-funcionario-html.js";

export function initLocacaoAdd() {
    new VisaoClienteEmHTML();
    new VisaoEquipamentoEmHTML();
    new VisaoFuncionarioEmHTML();
} 