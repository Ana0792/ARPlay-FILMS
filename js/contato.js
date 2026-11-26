/* finalizado*/

const whatsappBtn =
document.querySelector(
    ".contato-botoes .btn"
);

const instagramBtn =
document.querySelector(
    ".contato-botoes .btn-outline"
);

const telefone =
document.getElementById(
    "telefone-contato"
);

const instagram =
document.getElementById(
    "instagram-contato"
);

/*COPIAR TEXTO*/

async function copiarTexto(
    elemento,
    mensagem
) {

    if (!elemento) return;

    elemento.style.cursor =
    "pointer";

    elemento.title =
    "Clique para copiar";

    elemento.addEventListener(
        "click",
        async () => {

            try {

                await navigator
                .clipboard
                .writeText(
                    elemento.textContent
                );

                alert(
                    mensagem
                );

            }

            catch {

                console.log(
                    "Não foi possível copiar."
                );

            }

        }
    );

}

/*TELEFONE*/

copiarTexto(
    telefone,
    "Telefone copiado!"
);

/*INSTAGRAM*/

copiarTexto(
    instagram,
    "Instagram copiado!"
);