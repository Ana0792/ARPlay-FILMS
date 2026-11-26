# finalizado

from flask import (
    Flask,
    request,
    jsonify
)

from flask_cors import CORS

from banco import (
    conectar,
    criar_tabela,
    criar_tabela_orcamentos,
    atualizar_banco
)

import re

from datetime import (
    datetime
)

import json

# CONFIGURAÇÃO

app = Flask(__name__)

CORS(app)

criar_tabela()

criar_tabela_orcamentos()

atualizar_banco()

# VALIDAÇÕES

def validar_email(email):

    return re.fullmatch(

        r"[^@\s]+@[^@\s]+\.[^@\s]+",

        email

    ) is not None


def validar_telefone(telefone):

    numeros = re.sub(

        r"\D",

        "",

        telefone

    )

    return 10 <= len(numeros) <= 11

# UTILITÁRIOS

def gerar_codigo():

    conexao = conectar()

    ultimo_id = conexao.execute(
        """
        SELECT MAX(id)
        FROM orcamentos
        """
    ).fetchone()[0]

    conexao.close()

    numero = (
        ultimo_id or 0
    ) + 1

    ano = datetime.now().year

    return f"ARP-{ano}-{numero:04d}"


def data_hora_atual():

    return datetime.now().strftime(
        "%d/%m/%Y %H:%M:%S"
    )


def criar_historico_inicial():

    historico = [

        {
            "data":
            data_hora_atual(),

            "acao":
            "Orçamento criado"
        }

    ]

    return json.dumps(
        historico,
        ensure_ascii=False
    )


def adicionar_historico(
    historico_atual,
    mensagem
):

    try:

        historico = json.loads(
            historico_atual
        )

    except:

        historico = []

    historico.append(

        {
            "data":
            data_hora_atual(),

            "acao":
            mensagem
        }

    )

    return json.dumps(
        historico,
        ensure_ascii=False
    )

# HOME

@app.route("/")
def home():

    return jsonify(

        {
            "mensagem":
            "API ARPlay Films funcionando"
        }

    )

# CLIENTES

@app.route(
    "/clientes",
    methods=["POST"]
)
def cadastrar_cliente():

    dados = request.get_json()

    if not dados:

        return jsonify(
            {
                "erro":
                "Dados não enviados"
            }
        ), 400

    nome = dados.get(
        "nome",
        ""
    ).strip()

    email = dados.get(
        "email",
        ""
    ).strip()

    telefone = dados.get(
        "telefone",
        ""
    ).strip()

    if not nome:

        return jsonify(
            {
                "erro":
                "Nome obrigatório"
            }
        ), 400

    if not validar_email(
        email
    ):

        return jsonify(
            {
                "erro":
                "E-mail inválido"
            }
        ), 400

    if not validar_telefone(
        telefone
    ):

        return jsonify(
            {
                "erro":
                "Telefone inválido"
            }
        ), 400

    conexao = conectar()

    try:

        cursor = conexao.execute(
            """
            INSERT INTO clientes
            (
                nome,
                email,
                telefone
            )
            VALUES (?, ?, ?)
            """,
            (
                nome,
                email,
                telefone
            )
        )

        conexao.commit()

        return jsonify(
            {
                "mensagem":
                "Cliente cadastrado com sucesso",

                "id":
                cursor.lastrowid
            }
        ), 201

    except Exception:

        return jsonify(
            {
                "erro":
                "E-mail já cadastrado"
            }
        ), 400

    finally:

        conexao.close()


@app.route(
    "/clientes",
    methods=["GET"]
)
def listar_clientes():

    conexao = conectar()

    clientes = conexao.execute(
        """
        SELECT *
        FROM clientes
        ORDER BY id DESC
        """
    ).fetchall()

    conexao.close()

    return jsonify(

        [
            dict(cliente)
            for cliente in clientes
        ]

    )

# ORÇAMENTOS - CADASTRAR

@app.route(
    "/orcamentos",
    methods=["POST"]
)
def cadastrar_orcamento():

    dados = request.get_json()

    if not dados:

        return jsonify(
            {
                "erro":
                "Nenhum dado recebido"
            }
        ), 400

    conexao = None

    try:

        codigo = gerar_codigo()

        historico = criar_historico_inicial()

        ultima_atualizacao = data_hora_atual()

        conexao = conectar()

        conexao.execute(
            """
            INSERT INTO orcamentos
            (

                codigo,

                nome,
                telefone,
                email,

                tipoEvento,

                dataEvento,
                horaEvento,

                localEvento,

                servicos,

                descricao,

                funcionario,

                valorEstimado,
                valorAprovado,

                observacaoInterna,

                historico,

                ultimaAtualizacao,

                status

            )

            VALUES
            (

                ?,?,?,?,?,?,
                ?,?,?,?,?,?,
                ?,?,?,?,?

            )
            """,
            (

                codigo,

                dados.get("nome"),

                dados.get("telefone"),

                dados.get("email"),

                dados.get("tipoEvento"),

                dados.get("dataEvento"),

                dados.get("horaEvento"),

                dados.get("localEvento"),

                dados.get("servicos"),

                dados.get("descricao"),

                dados.get(
                    "funcionario",
                    "Não atribuído"
                ),

                dados.get(
                    "valorEstimado",
                    0
                ),

                dados.get(
                    "valorAprovado",
                    0
                ),

                "",

                historico,

                ultima_atualizacao,

                "Pendente"

            )
        )

        conexao.commit()

        return jsonify(

            {
                "mensagem":
                "Orçamento cadastrado com sucesso",

                "codigo":
                codigo
            }

        ), 201

    except Exception as erro:

        return jsonify(

            {
                "erro":
                str(erro)
            }

        ), 500

    finally:

        if conexao:

            conexao.close()

# ORÇAMENTOS - LISTAR

@app.route(
    "/orcamentos",
    methods=["GET"]
)
def listar_orcamentos():

    conexao = conectar()

    orcamentos = conexao.execute(
        """
        SELECT *
        FROM orcamentos
        ORDER BY id DESC
        """
    ).fetchall()

    conexao.close()

    return jsonify(

        [
            dict(orcamento)
            for orcamento in orcamentos
        ]

    )

# ORÇAMENTOS - STATUS

@app.route(
    "/orcamentos/<int:id>/status",
    methods=["PUT"]
)
def alterar_status(id):

    dados = request.get_json()

    status = dados.get(
        "status"
    )

    status_validos = [

        "Pendente",

        "Em análise",

        "Confirmado",

        "Cancelado"

    ]

    if status not in status_validos:

        return jsonify(
            {
                "erro":
                "Status inválido"
            }
        ), 400

    conexao = conectar()

    orcamento = conexao.execute(
        """
        SELECT *
        FROM orcamentos
        WHERE id = ?
        """,
        (id,)
    ).fetchone()

    if not orcamento:

        conexao.close()

        return jsonify(
            {
                "erro":
                "Orçamento não encontrado"
            }
        ), 404

    historico = adicionar_historico(

        orcamento["historico"],

        f"Status alterado para {status}"

    )

    cursor = conexao.execute(
        """
        UPDATE orcamentos
        SET

            status = ?,

            historico = ?,

            ultimaAtualizacao = ?

        WHERE id = ?
        """,
        (
            status,
            historico,
            data_hora_atual(),
            id
        )
    )

    conexao.commit()

    conexao.close()

    if cursor.rowcount == 0:

        return jsonify(
            {
                "erro":
                "Orçamento não encontrado"
            }
        ), 404

    return jsonify(
        {
            "mensagem":
            "Status atualizado com sucesso"
        }
    )

# ORÇAMENTOS - ADMIN

@app.route(
    "/orcamentos/<int:id>/admin",
    methods=["PUT"]
)
def atualizar_admin(id):

    dados = request.get_json()

    funcionario = dados.get(
        "funcionario",
        "Não atribuído"
    )

    observacao = dados.get(
        "observacaoInterna",
        ""
    )

    valor_estimado = dados.get(
        "valorEstimado",
        0
    )

    valor_aprovado = dados.get(
        "valorAprovado",
        0
    )

    conexao = conectar()

    orcamento = conexao.execute(
        """
        SELECT *
        FROM orcamentos
        WHERE id = ?
        """,
        (id,)
    ).fetchone()

    if not orcamento:

        conexao.close()

        return jsonify(
            {
                "erro":
                "Orçamento não encontrado"
            }
        ), 404

    historico = adicionar_historico(

        orcamento["historico"],

        "Dados administrativos atualizados"

    )

    cursor = conexao.execute(
        """
        UPDATE orcamentos
        SET

            funcionario = ?,

            valorEstimado = ?,

            valorAprovado = ?,

            observacaoInterna = ?,

            historico = ?,

            ultimaAtualizacao = ?

        WHERE id = ?
        """,
        (
            funcionario,
            valor_estimado,
            valor_aprovado,
            observacao,
            historico,
            data_hora_atual(),
            id
        )
    )

    conexao.commit()

    conexao.close()

    return jsonify(
        {
            "mensagem":
            "Dados administrativos atualizados"
        }
    )

# ORÇAMENTOS - EDITAR

@app.route(
    "/orcamentos/<int:id>",
    methods=["PUT"]
)
def editar_orcamento(id):

    dados = request.get_json()

    conexao = conectar()

    orcamento = conexao.execute(
        """
        SELECT *
        FROM orcamentos
        WHERE id = ?
        """,
        (id,)
    ).fetchone()

    if not orcamento:

        conexao.close()

        return jsonify(
            {
                "erro":
                "Orçamento não encontrado"
            }
        ), 404

    historico = adicionar_historico(

        orcamento["historico"],

        "Dados do orçamento atualizados"

    )

    cursor = conexao.execute(
        """
        UPDATE orcamentos
        SET

            nome = ?,

            telefone = ?,

            email = ?,

            tipoEvento = ?,

            dataEvento = ?,

            horaEvento = ?,

            localEvento = ?,

            servicos = ?,

            descricao = ?,

            historico = ?,

            ultimaAtualizacao = ?

        WHERE id = ?
        """,
        (
            dados.get("nome"),
            dados.get("telefone"),
            dados.get("email"),
            dados.get("tipoEvento"),
            dados.get("dataEvento"),
            dados.get("horaEvento"),
            dados.get("localEvento"),
            dados.get("servicos"),
            dados.get("descricao"),
            historico,
            data_hora_atual(),
            id
        )
    )

    conexao.commit()

    conexao.close()

    return jsonify(
        {
            "mensagem":
            "Orçamento atualizado com sucesso"
        }
    )

# ORÇAMENTOS - EXCLUIR

@app.route(
    "/orcamentos/<int:id>",
    methods=["DELETE"]
)
def excluir_orcamento(id):

    conexao = conectar()

    cursor = conexao.execute(
        """
        DELETE FROM orcamentos
        WHERE id = ?
        """,
        (id,)
    )

    conexao.commit()

    conexao.close()

    if cursor.rowcount == 0:

        return jsonify(
            {
                "erro":
                "Orçamento não encontrado"
            }
        ), 404

    return jsonify(
        {
            "mensagem":
            "Orçamento excluído com sucesso"
        }
    )

if __name__ == "__main__":

    app.run(
        debug=False
    )