/* finalizado */

/*TIMER REC*/

const timer =
document.getElementById(
    "timer"
);

if (timer) {

    let inicioGravacao =
    Date.now();

    setInterval(() => {

        let tempo =
        Date.now() -
        inicioGravacao;

        if (tempo >= 3600000) {

            inicioGravacao =
            Date.now();

            tempo = 0;

        }

        const minutos =
        Math.floor(
            tempo / 60000
        );

        const segundos =
        Math.floor(
            (tempo % 60000) / 1000
        );

        const centesimos =
        Math.floor(
            (tempo % 1000) / 10
        );

        timer.textContent =

        `${String(minutos)
        .padStart(2, "0")}:`

        +

        `${String(segundos)
        .padStart(2, "0")}:`

        +

        `${String(centesimos)
        .padStart(2, "0")}`;

    }, 10);

}

/*MENU MOBILE*/

const menuBtn =
document.getElementById(
    "menu-btn"
);

const nav =
document.getElementById(
    "nav"
);

if (menuBtn && nav) {

    menuBtn.addEventListener(
        "click",
        () => {

            nav.dataset.open =

            nav.dataset.open ===
            "true"

            ? "false"
            : "true";

        }
    );

    nav
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                nav.dataset.open =
                "false";

            }
        );

    });

}

/*HEADER*/

const header =
document.getElementById(
    "hdr"
);

window.addEventListener(
    "scroll",
    () => {

        if (!header) return;

        header.classList.toggle(
            "solid",
            window.scrollY > 50
        );

    }
);

/*DATA MÍNIMA*/

const campoData =
document.getElementById(
    "dataEvento"
);

if (campoData) {

    const amanha =
    new Date();

    amanha.setDate(
        amanha.getDate() + 1
    );

    campoData.min =

    amanha
    .toISOString()
    .split("T")[0];

}

/*TICKET*/

const ticketNome =
document.getElementById(
    "ticketNome"
);

const ticketTelefone =
document.getElementById(
    "ticketTelefone"
);

const ticketEvento =
document.getElementById(
    "ticketEvento"
);

const ticketData =
document.getElementById(
    "ticketData"
);

const ticketHora =
document.getElementById(
    "ticketHora"
);

const ticketLocal =
document.getElementById(
    "ticketLocal"
);

function atualizarTicket() {

    const nome =
    document
    .getElementById("nome")
    ?.value
    .trim() || "";

    const telefone =
    document
    .getElementById("telefone")
    ?.value
    .trim() || "";

    const evento =
    document
    .getElementById("tipoEvento")
    ?.value || "";

    const data =
    document
    .getElementById("dataEvento")
    ?.value || "";

    const hora =
    document
    .getElementById("horaEvento")
    ?.value || "";

    const local =
    document
    .getElementById("localEvento")
    ?.value
    .trim() || "";

    if (ticketNome) {

        ticketNome.textContent =
        nome || "—";

    }

    if (ticketTelefone) {

        ticketTelefone.textContent =
        telefone || "—";

    }

    if (ticketEvento) {

        ticketEvento.textContent =
        evento || "—";

    }

    if (ticketData) {

        ticketData.textContent =
        data || "—";

    }

    if (ticketHora) {

        ticketHora.textContent =
        hora || "—";

    }

    if (ticketLocal) {

        ticketLocal.textContent =
        local || "—";

    }

}

[
    "nome",
    "telefone",
    "tipoEvento",
    "dataEvento",
    "horaEvento",
    "localEvento"
]

.forEach(id => {

    const campo =
    document.getElementById(
        id
    );

    if (!campo) return;

    campo.addEventListener(
        "input",
        atualizarTicket
    );

    campo.addEventListener(
        "change",
        atualizarTicket
    );

});

atualizarTicket();

/*VALIDAÇÃO*/

function telefoneValido(
    telefone
) {

    const numeros =
    telefone.replace(
        /\D/g,
        ""
    );

    return (

        numeros.length >= 10 &&

        numeros.length <= 13

    );

}

function emailValido(
    email
) {

    const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return regex.test(
        email
    );

}

/*FORMULÁRIO*/

const form =
document.getElementById(
    "orcamentoForm"
);

if (form) {

    form.addEventListener(

        "submit",

        async (e) => {

            e.preventDefault();

            const nome =

            document
            .getElementById("nome")
            .value
            .trim();

            const telefone =

            document
            .getElementById("telefone")
            .value
            .trim();

            const email =

            document
            .getElementById("email")
            .value
            .trim();

            const dataEvento =

            document
            .getElementById("dataEvento")
            .value;

            const horaEvento =

            document
            .getElementById("horaEvento")
            .value;

            if (!nome) {

                alert(
                    "Digite seu nome."
                );

                return;

            }

            if (
                !telefoneValido(
                    telefone
                )
            ) {

                alert(
                    "Digite um telefone válido."
                );

                return;

            }

            if (
                !emailValido(
                    email
                )
            ) {

                alert(
                    "Digite um e-mail válido."
                );

                return;

            }

            if (!dataEvento) {

                alert(
                    "Selecione a data do evento."
                );

                return;

            }

            if (!horaEvento) {

                alert(
                    "Selecione o horário do evento."
                );

                return;

            }

            const dados = {

                nome,

                telefone,

                email,

                tipoEvento:

                document
                .getElementById(
                    "tipoEvento"
                )
                .value,

                dataEvento,

                horaEvento,

                localEvento:

                document
                .getElementById(
                    "localEvento"
                )
                .value,

                descricao:

                document
                .getElementById(
                    "descricao"
                )
                .value
                .trim()

            };

            try {

                const resposta =

                await fetch(
                    "http://127.0.0.1:5000/orcamentos",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                            "application/json"

                        },

                        body:
                        JSON.stringify(
                            dados
                        )

                    }
                );

                const resultado =
                await resposta.json();

                if (
                    !resposta.ok
                ) {

                    throw new Error(

                        resultado.erro ||

                        "Erro ao enviar"

                    );

                }

                alert(

`✅ Orçamento enviado com sucesso!

Código:
${resultado.codigo}`

                );

                form.reset();

                atualizarTicket();

            }

            catch (erro) {

                console.error(
                    erro
                );

                alert(
                    "Erro ao enviar orçamento."
                );

            }

        }

    );

}

/*SCROLL SUAVE*/

document

.querySelectorAll(
    'a[href^="#"]'
)

.forEach(link => {

    link.addEventListener(

        "click",

        (e) => {

            const alvo =

            document.querySelector(

                link.getAttribute(
                    "href"
                )

            );

            if (!alvo) return;

            e.preventDefault();

            alvo.scrollIntoView({

                behavior:
                "smooth"

            });

        }

    );

});

/*FAQ*/

const faqItems =

document.querySelectorAll(
    ".faq-item"
);

faqItems.forEach(item => {

    const pergunta =

    item.querySelector(
        ".faq-pergunta"
    );

    pergunta?.addEventListener(

        "click",

        () => {

            const ativa =

            item.classList.contains(
                "ativo"
            );

            faqItems.forEach(
                faq => {

                    faq.classList.remove(
                        "ativo"
                    );

                }
            );

            if (!ativa) {

                item.classList.add(
                    "ativo"
                );

            }

        }

    );

});

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

let tamanhoFonte =
100;

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
            .toggle(
                "ativo"
            );

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
                .remove(
                    "ativo"
                );

            }

        }

    );

}

fonteMaior?.addEventListener(

    "click",

    () => {

        if (

            tamanhoFonte >= 140

        ) return;

        tamanhoFonte += 10;

        document.documentElement
        .style.fontSize =

        tamanhoFonte + "%";

        if (fontLevel) {

            fontLevel.style.width =

            ((tamanhoFonte - 80) / 60)

            * 100

            + "%";

        }

    }

);

fonteMenor?.addEventListener(

    "click",

    () => {

        if (

            tamanhoFonte <= 80

        ) return;

        tamanhoFonte -= 10;

        document.documentElement
        .style.fontSize =

        tamanhoFonte + "%";

        if (fontLevel) {

            fontLevel.style.width =

            ((tamanhoFonte - 80) / 60)

            * 100

            + "%";

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
        .style.fontSize = "100%";

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