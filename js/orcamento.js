/* finalizado */

const API =
"http://127.0.0.1:5000"

const params =
new URLSearchParams(
    window.location.search
);

const id =
params.get("id");

let orcamento = null;

/*CARREGAR ORÇAMENTO*/

async function carregarOrcamento() {

    try {

        const resposta =
        await fetch(
            `${API}/orcamentos`
        );

        const lista =
        await resposta.json();

        orcamento =
        lista.find(
            item => item.id == id
        );

        if (!orcamento) {

            alert(
                "Orçamento não encontrado."
            );

            window.location =
            "painel.html";

            return;

        }

        preencherCampos();

    }

    catch (erro) {

        console.error(
            erro
        );

        alert(
            "Erro ao carregar orçamento."
        );

    }

}

/*PREENCHER CAMPOS*/

function preencherCampos() {

    document.getElementById(
        "tituloCodigo"
    ).textContent =
    orcamento.codigo;

    document.getElementById(
        "codigo"
    ).textContent =
    orcamento.codigo;

    document.getElementById(
        "criadoEm"
    ).textContent =
    orcamento.criadoEm || "-";

    document.getElementById(
        "nome"
    ).value =
    orcamento.nome || "";

    document.getElementById(
        "telefone"
    ).value =
    orcamento.telefone || "";

    document.getElementById(
        "email"
    ).value =
    orcamento.email || "";

    document.getElementById(
        "tipoEvento"
    ).value =
    orcamento.tipoEvento || "";

    document.getElementById(
        "dataEvento"
    ).value =
    orcamento.dataEvento || "";

    document.getElementById(
        "horaEvento"
    ).value =
    orcamento.horaEvento || "";

    document.getElementById(
        "localEvento"
    ).value =
    orcamento.localEvento || "";

    document.getElementById(
        "servicos"
    ).value =
    orcamento.servicos || "";

    document.getElementById(
        "descricao"
    ).value =
    orcamento.descricao || "";

    document.getElementById(
        "funcionario"
    ).value =
    orcamento.funcionario || "";

    document.getElementById(
        "status"
    ).value =
    orcamento.status || "Pendente";

    document.getElementById(
        "observacaoInterna"
    ).value =
    orcamento.observacaoInterna || "";

    document.getElementById(
        "valorEstimado"
    ).value =
    orcamento.valorEstimado || "";

    document.getElementById(
        "valorAprovado"
    ).value =
    orcamento.valorAprovado || "";

    const ultimaAtualizacao =
    document.getElementById(
        "ultimaAtualizacao"
    );

    if (ultimaAtualizacao) {

        ultimaAtualizacao.textContent =

        orcamento.ultimaAtualizacao ||

        "Nenhuma alteração";

    }

    preencherHistorico();

}

/*HISTÓRICO*/

function preencherHistorico() {

    const historico =
    document.getElementById(
        "historico"
    );

    if (!historico) {

        return;

    }

    if (
        !orcamento.historico
    ) {

        historico.innerHTML =

        `
        <p>
            Nenhuma alteração registrada.
        </p>
        `;

        return;

    }

    try {

        const listaHistorico =

        JSON.parse(
            orcamento.historico
        );

        historico.innerHTML =

        listaHistorico

        .slice()

        .reverse()

        .map(item => `

            <div class="historico-item">

                <strong>
                    ${item.data}
                </strong>

                <p>
                    ${item.acao}
                </p>

            </div>

        `)

        .join("");

    }

    catch {

        historico.innerHTML =

        `
        <p>
            Histórico indisponível.
        </p>
        `;

    }

}

/*SALVAR*/

document
.getElementById("salvar")
?.addEventListener(
    "click",
    async () => {

        const alteracoes = [];

        const verificar = (
            campo,
            antigo,
            novo
        ) => {

            antigo = String(
                antigo || ""
            ).trim();

            novo = String(
                novo || ""
            ).trim();

            if (
                antigo === novo
            ) {

                return;

            }

            alteracoes.push(

`${campo}: ${antigo || "(vazio)"} → ${novo || "(vazio)"}`

            );

        };

        verificar(
            "Nome",
            orcamento.nome,
            document.getElementById("nome").value
        );

        verificar(
            "Telefone",
            orcamento.telefone,
            document.getElementById("telefone").value
        );

        verificar(
            "Email",
            orcamento.email,
            document.getElementById("email").value
        );

        verificar(
            "Tipo de Evento",
            orcamento.tipoEvento,
            document.getElementById("tipoEvento").value
        );

        verificar(
            "Data",
            orcamento.dataEvento,
            document.getElementById("dataEvento").value
        );

        verificar(
            "Hora",
            orcamento.horaEvento,
            document.getElementById("horaEvento").value
        );

        verificar(
            "Local",
            orcamento.localEvento,
            document.getElementById("localEvento").value
        );

        verificar(
            "Serviços",
            orcamento.servicos,
            document.getElementById("servicos").value
        );

        verificar(
            "Descrição",
            orcamento.descricao,
            document.getElementById("descricao").value
        );

        verificar(
            "Funcionário",
            orcamento.funcionario,
            document.getElementById("funcionario").value
        );

        verificar(
            "Status",
            orcamento.status,
            document.getElementById("status").value
        );

        verificar(
            "Observação",
            orcamento.observacaoInterna,
            document.getElementById(
                "observacaoInterna"
            ).value
        );

        verificar(
            "Valor Estimado",
            orcamento.valorEstimado,
            document.getElementById(
                "valorEstimado"
            ).value
        );

        verificar(
            "Valor Aprovado",
            orcamento.valorAprovado,
            document.getElementById(
                "valorAprovado"
            ).value
        );

        if (
            alteracoes.length === 0
        ) {

            alert(
                "Nenhuma alteração foi realizada."
            );

            return;

        }

        const confirmar =
        confirm(

`CONFIRMAR ALTERAÇÕES

${alteracoes.join("\n")}

Deseja salvar as alterações?`

        );

        if (!confirmar) {

            return;

        }

        try {

            const respostaPrincipal =
            await fetch(
                `${API}/orcamentos/${id}`,
                {

                    method:"PUT",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        nome:
                        document.getElementById("nome").value,

                        telefone:
                        document.getElementById("telefone").value,

                        email:
                        document.getElementById("email").value,

                        tipoEvento:
                        document.getElementById("tipoEvento").value,

                        dataEvento:
                        document.getElementById("dataEvento").value,

                        horaEvento:
                        document.getElementById("horaEvento").value,

                        localEvento:
                        document.getElementById("localEvento").value,

                        servicos:
                        document.getElementById("servicos").value,

                        descricao:
                        document.getElementById("descricao").value

                    })

                }
            );

            const respostaAdmin =
            await fetch(
                `${API}/orcamentos/${id}/admin`,
                {

                    method:"PUT",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        funcionario:
                        document.getElementById(
                            "funcionario"
                        ).value,

                        observacaoInterna:
                        document.getElementById(
                            "observacaoInterna"
                        ).value,

                        valorEstimado:
                        document.getElementById(
                            "valorEstimado"
                        ).value,

                        valorAprovado:
                        document.getElementById(
                            "valorAprovado"
                        ).value

                    })

                }
            );

            const respostaStatus =
            await fetch(
                `${API}/orcamentos/${id}/status`,
                {

                    method:"PUT",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        status:
                        document.getElementById(
                            "status"
                        ).value

                    })

                }
            );

            if (

                !respostaPrincipal.ok ||

                !respostaAdmin.ok ||

                !respostaStatus.ok

            ) {

                throw new Error(
                    "Erro ao salvar."
                );

            }

            alert(
                "Alterações salvas com sucesso."
            );

            window.location.href =
            "painel.html";

        }

        catch (erro) {

            console.error(
                erro
            );

            alert(
                erro.message
            );

        }

    }
);

/*EXCLUIR*/

document
.getElementById("excluir")
?.addEventListener(
    "click",
    async () => {

        const confirmar =
        confirm(

`EXCLUIR ORÇAMENTO

Código: ${orcamento.codigo}

Cliente: ${orcamento.nome}

Esta ação não poderá ser desfeita.

Deseja continuar?`

        );

        if (!confirmar) {

            return;

        }

        try {

            const resposta =
            await fetch(

                `${API}/orcamentos/${id}`,

                {
                    method:"DELETE"
                }

            );

            if (!resposta.ok) {

                throw new Error(
                    "Erro ao excluir orçamento."
                );

            }

            alert(
                "Orçamento excluído com sucesso."
            );

            window.location.href =
            "painel.html";

        }

        catch (erro) {

            console.error(
                erro
            );

            alert(
                erro.message
            );

        }

    }
);

/*CANCELAR*/

document
.getElementById("cancelar")
?.addEventListener(
    "click",
    () => {

        const sair =
        confirm(
            "Deseja sair sem salvar?"
        );

        if (!sair) {

            return;

        }

        window.location.href =
        "painel.html";

    }
);

/*ACESSIBILIDADE*/

const acessibilidadeBtn =
document.getElementById(
    "acessibilidade-btn"
);

const acessibilidadePainel =
document.getElementById(
    "acessibilidade-painel"
);

const fonteMaior =
document.getElementById(
    "fonte-maior"
);

const fonteMenor =
document.getElementById(
    "fonte-menor"
);

const altoContraste =
document.getElementById(
    "alto-contraste"
);

const escalaCinza =
document.getElementById(
    "escala-cinza"
);

const destacarLinks =
document.getElementById(
    "destacar-links"
);

const resetar =
document.getElementById(
    "resetar"
);

const fontLevel =
document.getElementById(
    "font-level"
);

let tamanhoFonte = 100;

if (
    acessibilidadeBtn &&
    acessibilidadePainel
) {

    acessibilidadeBtn.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            acessibilidadePainel
            .classList
            .toggle("ativo");

        }
    );

    document.addEventListener(
        "click",
        (e) => {

            if (

                !acessibilidadePainel.contains(
                    e.target
                )

                &&

                !acessibilidadeBtn.contains(
                    e.target
                )

            ) {

                acessibilidadePainel
                .classList
                .remove("ativo");

            }

        }
    );

}

fonteMaior?.addEventListener(
    "click",
    () => {

        if (tamanhoFonte >= 140) {

            return;

        }

        tamanhoFonte += 10;

        document.documentElement
        .style.fontSize =
        tamanhoFonte + "%";

        if (fontLevel) {

            fontLevel.style.width =
            ((tamanhoFonte - 80) / 60)
            * 100 + "%";

        }

    }
);

fonteMenor?.addEventListener(
    "click",
    () => {

        if (tamanhoFonte <= 80) {

            return;

        }

        tamanhoFonte -= 10;

        document.documentElement
        .style.fontSize =
        tamanhoFonte + "%";

        if (fontLevel) {

            fontLevel.style.width =
            ((tamanhoFonte - 80) / 60)
            * 100 + "%";

        }

    }
);

altoContraste?.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "alto-contraste"
        );

        altoContraste.classList.toggle(
            "ativo"
        );

    }
);

escalaCinza?.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "escala-cinza"
        );

        escalaCinza.classList.toggle(
            "ativo"
        );

    }
);

destacarLinks?.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "destacar-links"
        );

        destacarLinks.classList.toggle(
            "ativo"
        );

    }
);

resetar?.addEventListener(
    "click",
    () => {

        tamanhoFonte = 100;

        document.documentElement
        .style.fontSize =
        "100%";

        if (fontLevel) {

            fontLevel.style.width =
            "50%";

        }

        document.body.classList.remove(
            "alto-contraste"
        );

        document.body.classList.remove(
            "escala-cinza"
        );

        document.body.classList.remove(
            "destacar-links"
        );

        altoContraste?.classList.remove(
            "ativo"
        );

        escalaCinza?.classList.remove(
            "ativo"
        );

        destacarLinks?.classList.remove(
            "ativo"
        );

    }
);

carregarOrcamento();