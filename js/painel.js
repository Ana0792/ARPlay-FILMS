/* finalizado */

/* PROTEÇÃO DO PAINEL */

const autenticado =
localStorage.getItem(
    "arplayAuth"
);

if(
    autenticado !== "true"
){

    window.location.href =
    "login.html";

}
const API =
"http://127.0.0.1:5000";

let orcamentos = [];

let filtroAtual =
"todos";

const contadorResultados =
document.getElementById(
    "contadorResultados"
);

const tabela =
document.getElementById(
    "tabela"
);

const busca =
document.getElementById(
    "busca"
);

/*KPI*/

const totalOrcamentos =
document.getElementById(
    "totalOrcamentos"
);

const totalPendentes =
document.getElementById(
    "totalPendentes"
);

const totalAnalise =
document.getElementById(
    "totalAnalise"
);

const totalConfirmados =
document.getElementById(
    "totalConfirmados"
);

/*FILTROS KPI*/

const filtroTodos =
document.getElementById(
    "filtroTodos"
);

const filtroPendentes =
document.getElementById(
    "filtroPendentes"
);

const filtroAnalise =
document.getElementById(
    "filtroAnalise"
);

const filtroConfirmados =
document.getElementById(
    "filtroConfirmados"
);

/*PRÓXIMO EVENTO*/

const proximoCodigo =
document.getElementById(
    "proximoCodigo"
);

const proximoEvento =
document.getElementById(
    "proximoEvento"
);

const proximaData =
document.getElementById(
    "proximaData"
);

const proximaHora =
document.getElementById(
    "proximaHora"
);

const proximoLocal =
document.getElementById(
    "proximoLocal"
);

/*ÚLTIMAS ALTERAÇÕES*/

const ultimasAlteracoes =
document.getElementById(
    "ultimasAlteracoes"
);

/*CARREGAR*/

async function carregarOrcamentos(){

    try{

        const resposta =
        await fetch(
            `${API}/orcamentos`
        );

        orcamentos =
        await resposta.json();

        atualizarKpis();

        atualizarProximoEvento();

        atualizarUltimasAlteracoes();

        aplicarFiltroAtual();

    }

    catch(erro){

        console.error(
            "Erro ao carregar:",
            erro
        );

    }

}

/*FORMATAR DATA*/

function formatarData(data){

    if(!data){

        return "-";

    }

    const partes =
    data.split("-");

    if(
        partes.length !== 3
    ){

        return data;

    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}

/*KPI */

function atualizarKpis(){

    const total =
    orcamentos.length;

    const pendentes =
    orcamentos.filter(
        o =>
        o.status ===
        "Pendente"
    ).length;

    const analise =
    orcamentos.filter(
        o =>
        o.status ===
        "Em análise"
    ).length;

    const confirmados =
    orcamentos.filter(
        o =>
        o.status ===
        "Confirmado"
    ).length;

    if(totalOrcamentos){

        totalOrcamentos.textContent =
        total;

    }

    if(totalPendentes){

        totalPendentes.textContent =
        pendentes;

    }

    if(totalAnalise){

        totalAnalise.textContent =
        analise;

    }

    if(totalConfirmados){

        totalConfirmados.textContent =
        confirmados;

    }

}

/*PRÓXIMO EVENTO*/

function atualizarProximoEvento(){

    if(
        !proximoCodigo ||
        !proximoEvento
    ){

        return;

    }

    const futuros =

    orcamentos

    .filter(
        item =>
        item.dataEvento
    )

    .sort(
        (a,b) =>
        new Date(
            a.dataEvento
        )
        -
        new Date(
            b.dataEvento
        )
    );

    if(
        futuros.length === 0
    ){

        return;

    }

    const evento =
    futuros[0];

    proximoCodigo.textContent =
    evento.codigo;

    proximoEvento.textContent =
    evento.tipoEvento;

    proximaData.textContent =
    formatarData(
        evento.dataEvento
    );

    proximaHora.textContent =
    evento.horaEvento ||
    "--";

    proximoLocal.textContent =
    evento.localEvento ||
    "--";

}

/*ÚLTIMAS ALTERAÇÕES*/

function atualizarUltimasAlteracoes(){

    if(
        !ultimasAlteracoes
    ){

        return;

    }

    const recentes =

    [...orcamentos]

    .sort(
        (a,b) =>
        (b.id || 0)
        -
        (a.id || 0)
    )

    .slice(0,5);

    if(
        recentes.length === 0
    ){

        ultimasAlteracoes.innerHTML =

        `<p>
            Nenhuma alteração registrada.
        </p>`;

        return;

    }

    ultimasAlteracoes.innerHTML =

    recentes.map(item => `

        <div class="alteracao-item">

            <strong>
                ${item.codigo}
            </strong>

            <span>

                ${item.nome}

            </span>

        </div>

    `)

    .join("");

}
function obterClasseStatus(status){

    switch(status){

        case "Confirmado":
            return "status-confirmado";

        case "Pendente":
            return "status-pendente";

        case "Em análise":
            return "status-analise";

        case "Cancelado":
            return "status-cancelado";

        default:
            return "";
    }

}

/*FILTROS KPI*/

function aplicarFiltroAtual(){

    switch(filtroAtual){

        case "pendentes":

            renderizarTabela(

                orcamentos.filter(
                    o =>
                    o.status ===
                    "Pendente"
                )

            );

            break;

        case "analise":

            renderizarTabela(

                orcamentos.filter(
                    o =>
                    o.status ===
                    "Em análise"
                )

            );

            break;

        case "confirmados":

            renderizarTabela(

                orcamentos.filter(
                    o =>
                    o.status ===
                    "Confirmado"
                )

            );

            break;

        default:

            renderizarTabela(
                orcamentos
            );

    }

}


filtroTodos?.addEventListener(
    "click",
    () => {

        filtroAtual =
        "todos";

        aplicarFiltroAtual();

    }
);

filtroPendentes?.addEventListener(
    "click",
    () => {

        filtroAtual =
        "pendentes";

        aplicarFiltroAtual();

    }
);

filtroAnalise?.addEventListener(
    "click",
    () => {

        filtroAtual =
        "analise";

        aplicarFiltroAtual();

    }
);

filtroConfirmados?.addEventListener(
    "click",
    () => {

        filtroAtual =
        "confirmados";

        aplicarFiltroAtual();

    }
);

/*TABELA*/

function renderizarTabela(
    lista
){

    let html = "";

    lista.forEach(item => {

        html += `

        <tr>

            <td>

                <a
                href="orcamento.html?id=${item.id}">

                    ${item.codigo}

                </a>

            </td>

            <td>
                ${item.nome}
            </td>

            <td>
                ${item.telefone || "-"}
            </td>

            <td>
                ${item.tipoEvento || "-"}
            </td>

            <td>
                ${formatarData(
                    item.dataEvento
                )}
            </td>

            <td>
                ${
                    item.funcionario ||
                    "Não atribuído"
                }
            </td>

            <td>
                R$ ${
                    item.valorEstimado || 0
                }
            </td>

            <td>
                R$ ${
                    item.valorAprovado || 0
                }
            </td>

            <td>

                <select
class="status-select ${obterClasseStatus(item.status)}"
onchange="
alterarStatus(
    ${item.id},
    this.value
)">

                    <option
                    value="Pendente"
                    ${
                        item.status === "Pendente"
                        ? "selected"
                        : ""
                    }>
                        Pendente
                    </option>

                    <option
                    value="Em análise"
                    ${
                        item.status === "Em análise"
                        ? "selected"
                        : ""
                    }>
                        Em análise
                    </option>

                    <option
                    value="Confirmado"
                    ${
                        item.status === "Confirmado"
                        ? "selected"
                        : ""
                    }>
                        Confirmado
                    </option>

                    <option
                    value="Cancelado"
                    ${
                        item.status === "Cancelado"
                        ? "selected"
                        : ""
                    }>
                        Cancelado
                    </option>

                </select>

            </td>
<td class="obs-cell">

    ${
        item.descricao
        ? item.descricao.substring(0,50) + (
            item.descricao.length > 50
            ? "..."
            : ""
        )
        : "-"
    }

</td>

<td>

    <button
    class="btn-sm"
    onclick="
    window.location.href=
    'orcamento.html?id=${item.id}'
    ">

        Abrir

    </button>

</td>
        `;

    });
    if(contadorResultados){

    contadorResultados.textContent =
    `Mostrando ${lista.length} resultados`;

}

    tabela.innerHTML =
    html;

}
/*STATUS*/

async function alterarStatus(
    id,
    status
){

    try{

        await fetch(

            `${API}/orcamentos/${id}/status`,

            {
                method:"PUT",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    status
                })

            }

        );

        carregarOrcamentos();

    }

    catch(erro){

        console.error(
            erro
        );

    }

}
/*MODAL*/

const btnNovoOrcamento =
document.getElementById(
    "novoOrcamento"
);

const modalNovo =
document.getElementById(
    "modalNovo"
);

const fecharNovo =
document.getElementById(
    "fecharNovo"
);

btnNovoOrcamento
?.addEventListener(
    "click",
    () => {

        modalNovo.hidden =
        false;

    }
);

fecharNovo
?.addEventListener(
    "click",
    () => {

        modalNovo.hidden =
        true;

    }
);
/*BUSCA*/

if (busca) {

    busca.addEventListener(
        "input",
        () => {

            const termo =
            busca.value
            .toLowerCase();

            const filtrados =

            orcamentos.filter(
                item =>

                (item.nome || "")
                .toLowerCase()
                .includes(termo)

                ||

                (item.codigo || "")
                .toLowerCase()
                .includes(termo)

                ||

                (item.tipoEvento || "")
                .toLowerCase()
                .includes(termo)

                ||

                (item.funcionario || "")
                .toLowerCase()
                .includes(termo)

                ||

                (item.localEvento || "")
                .toLowerCase()
                .includes(termo)

                ||

                (item.telefone || "")
                .toLowerCase()
                .includes(termo)

            );

            renderizarTabela(
                filtrados
            );

        }
    );

}
/*NOVO ORÇAMENTO*/

document
.getElementById(
    "formNovo"
)
?.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const dados = {

            nome:
            document.getElementById(
                "novoNome"
            ).value,

            telefone:
            document.getElementById(
                "novoTelefone"
            ).value,

            email:
            document.getElementById(
                "novoEmail"
            ).value,

            tipoEvento:
            document.getElementById(
                "novoEvento"
            ).value,

            funcionario:
            document.getElementById(
                "novoFuncionario"
            ).value ||

            "Não atribuído",

            valorEstimado:
            document.getElementById(
                "novoValorEstimado"
            )?.value || 0,

            valorAprovado:
            document.getElementById(
                "novoValorAprovado"
            )?.value || 0,

            dataEvento:
            document.getElementById(
                "novoData"
            ).value,

            horaEvento:
            document.getElementById(
                "novoHora"
            ).value,

            localEvento:
            document.getElementById(
                "novoLocal"
            ).value,

            servicos:
            document.getElementById(
                "novoServicos"
            ).value,

            descricao:
            document.getElementById(
                "novoDescricao"
            ).value

        };

        try {

            const resposta =

            await fetch(

                `${API}/orcamentos`,

                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify(
                        dados
                    )

                }

            );

            const resultado =
            await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    resultado.erro
                );

            }

            alert(
                `Orçamento criado: ${resultado.codigo}`
            );

            modalNovo.hidden =
            true;

            document
            .getElementById(
                "formNovo"
            )
            .reset();

            carregarOrcamentos();

        }

        catch (erro) {

            alert(
                erro.message
            );

        }

    }
);

const logoutBtn =
document.getElementById(
    "logoutBtn"
);

logoutBtn?.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "arplayAuth"
        );

        window.location.href =
        "login.html";

    }
);

/*INICIAR*/

carregarOrcamentos();