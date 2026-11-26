/* finalizado */

const filtros = document.querySelectorAll(".filtro");
const itens = document.querySelectorAll(".portfolio-item");

const legenda =
document.getElementById("legendaCategoria");

const vazio =
document.getElementById("portfolioVazio");

const filtrosTipo =
document.getElementById("filtrosTipo");

let categoriaAtual = "todos";

/* IMAGENS */

const imagens = Array.from(
    document.querySelectorAll(
        "img.portfolio-item"
    )
);

let imagemAtual = 0;

/* TEXTOS */

const textos = {

    todos:
    "Exibindo todos os registros da ARPlay Films.",

    casamento:
    "Registros de casamentos e cerimônias.",

    corporativo:
    "Coberturas corporativas e eventos empresariais.",

    ensaio:
    "Ensaios fotográficos realizados pela ARPlay Films.",

    formatura:
    "Coberturas de colações, bailes e formaturas.",

    quinze:
    "Ainda não existem registros nesta categoria."

};

/* FILTROS */

filtros.forEach(botao => {

    botao.addEventListener("click", () => {

        categoriaAtual =
        botao.dataset.filtro;

        filtros.forEach(item => {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        aplicarFiltro(categoriaAtual);

    });

});

/* FILTRAR CATEGORIA */

function aplicarFiltro(categoria){

    if(
        legenda &&
        textos[categoria]
    ){
        legenda.textContent =
        textos[categoria];
    }

    if(categoria === "quinze"){

        itens.forEach(item => {
            item.classList.add("hidden");
        });

        if(filtrosTipo){
            filtrosTipo.style.display =
            "none";
        }

        if(vazio){

            vazio.classList.remove(
                "hidden"
            );

            vazio.innerHTML = `
                <h3>Em breve</h3>
                <p>
                    Ainda não existem registros
                    nesta categoria.
                </p>
            `;

        }

        return;

    }

    if(vazio){
        vazio.classList.add("hidden");
    }

    if(categoria === "todos"){

        itens.forEach(item => {
            item.classList.remove(
                "hidden"
            );
        });

        if(filtrosTipo){
            filtrosTipo.style.display =
            "none";
        }

        return;

    }

    itens.forEach(item => {

        if(
            item.dataset.categoria ===
            categoria
        ){

            item.classList.remove(
                "hidden"
            );

        }else{

            item.classList.add(
                "hidden"
            );

        }

    });

    if(filtrosTipo){
        filtrosTipo.style.display =
        "flex";
    }

}

/* FILTRAR TIPO */

function filtrarTipo(tipo){

    let encontrados = 0;

    itens.forEach(item => {

        const categoria =
        item.dataset.categoria;

        const tipoItem =
        item.dataset.tipo;

        if(

            categoria === categoriaAtual &&
            tipoItem === tipo

        ){

            item.classList.remove(
                "hidden"
            );

            encontrados++;

        }else{

            item.classList.add(
                "hidden"
            );

        }

    });

    if(encontrados === 0){

        if(vazio){

            vazio.classList.remove(
                "hidden"
            );

            vazio.innerHTML = `
                <h3>
                    Nenhum registro encontrado
                </h3>

                <p>
                    Ainda não existem ${
                        tipo === "foto"
                        ? "fotos"
                        : "vídeos"
                    } nesta categoria.
                </p>
            `;

        }

    }else{

        if(vazio){
            vazio.classList.add(
                "hidden"
            );
        }

    }

}

/* APENAS UM VÍDEO */

const videos =
document.querySelectorAll(
    "video"
);

videos.forEach(video => {

    video.addEventListener(
        "play",
        () => {

            videos.forEach(v => {

                if(v !== video){
                    v.pause();
                }

            });

        }
    );

});

/* LIGHTBOX */

imagens.forEach(img => {

    img.addEventListener(
        "click",
        () => {

            const imagensVisiveis =
            imagens.filter(item =>
                !item.classList.contains(
                    "hidden"
                )
            );

            imagemAtual =
            imagensVisiveis.indexOf(img);

            abrirLightbox(
                imagensVisiveis
            );

        }
    );

});

function abrirLightbox(
    imagensVisiveis
){

    if(
        document.getElementById(
            "lightbox"
        )
    ){
        return;
    }

    const overlay =
    document.createElement("div");

    overlay.id =
    "lightbox";

    overlay.innerHTML = `
        <div class="lightbox-bg">

            <button
            class="btn-prev">
            ❮
            </button>

            <img
            id="imgLightbox"
            src="${imagensVisiveis[imagemAtual].src}">

            <button
            class="btn-next">
            ❯
            </button>

            <button
            class="btn-close">
            ✕
            </button>

        </div>
    `;

    document.body.appendChild(
        overlay
    );

    const imagem =
    document.getElementById(
        "imgLightbox"
    );

    function atualizar(){

        imagem.src =
        imagensVisiveis[
            imagemAtual
        ].src;

    }

    overlay
    .querySelector(".btn-next")
    .addEventListener(
        "click",
        () => {

            imagemAtual++;

            if(
                imagemAtual >=
                imagensVisiveis.length
            ){
                imagemAtual = 0;
            }

            atualizar();

        }
    );

    overlay
    .querySelector(".btn-prev")
    .addEventListener(
        "click",
        () => {

            imagemAtual--;

            if(
                imagemAtual < 0
            ){
                imagemAtual =
                imagensVisiveis.length - 1;
            }

            atualizar();

        }
    );

    function fechar(){

        document.onkeydown =
        null;

        overlay.remove();

    }

    overlay
    .querySelector(".btn-close")
    .addEventListener(
        "click",
        fechar
    );

    overlay.addEventListener(
        "click",
        e => {

            if(
                e.target === overlay
            ){
                fechar();
            }

        }
    );

    document.onkeydown =
    e => {

        if(
            e.key ===
            "ArrowRight"
        ){

            overlay
            .querySelector(
                ".btn-next"
            )
            .click();

        }

        if(
            e.key ===
            "ArrowLeft"
        ){

            overlay
            .querySelector(
                ".btn-prev"
            )
            .click();

        }

        if(
            e.key ===
            "Escape"
        ){

            fechar();

        }

    };

}

/* INICIAR */

aplicarFiltro("todos");