/* finalizado */

const form =
document.getElementById(
    "loginForm"
);

form?.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();

        const usuario =
        document
        .getElementById(
            "usuario"
        )
        .value
        .trim();

        const senha =
        document
        .getElementById(
            "senha"
        )
        .value
        .trim();

        /* LOGIN TEMPORÁRIO */

        if(
            usuario === "admin"
            &&
            senha === "123456"
        ){

            localStorage.setItem(
                "arplayAuth",
                "true"
            );

            window.location.href =
            "painel.html";

            return;

        }

        alert(
            "Usuário ou senha inválidos."
        );

    }
);
