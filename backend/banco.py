# finalizado

import sqlite3

def conectar():

    conexao = sqlite3.connect(
        "clientes.db"
    )

    conexao.row_factory = sqlite3.Row

    return conexao

# CLIENTES

def criar_tabela():

    conexao = conectar()

    conexao.execute(
        """
        CREATE TABLE IF NOT EXISTS clientes (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nome TEXT NOT NULL,

            email TEXT NOT NULL UNIQUE,

            telefone TEXT NOT NULL

        )
        """
    )

    conexao.commit()

    conexao.close()

# ORÇAMENTOS

def criar_tabela_orcamentos():

    conexao = conectar()

    conexao.execute(
        """
        CREATE TABLE IF NOT EXISTS orcamentos (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            codigo TEXT UNIQUE,

            nome TEXT NOT NULL,

            telefone TEXT NOT NULL,

            email TEXT NOT NULL,

            tipoEvento TEXT NOT NULL,

            dataEvento TEXT,

            horaEvento TEXT,

            localEvento TEXT,

            servicos TEXT,

            descricao TEXT,

            funcionario TEXT,

            valorEstimado REAL DEFAULT 0,

            valorAprovado REAL DEFAULT 0,

            observacaoInterna TEXT,

            historico TEXT,

            ultimaAtualizacao TEXT,

            status TEXT DEFAULT 'Pendente',

            criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
        """
    )

    conexao.commit()

    conexao.close()

# ATUALIZAÇÕES AUTOMÁTICAS

def atualizar_banco():

    conexao = conectar()

    colunas = [

        (
            "funcionario",
            "TEXT"
        ),

        (
            "valorEstimado",
            "REAL DEFAULT 0"
        ),

        (
            "valorAprovado",
            "REAL DEFAULT 0"
        ),

        (
            "observacaoInterna",
            "TEXT"
        ),

        (
            "historico",
            "TEXT"
        ),

        (
            "ultimaAtualizacao",
            "TEXT"
        )

    ]

    for nome, tipo in colunas:

        try:

            conexao.execute(
                f"""
                ALTER TABLE orcamentos
                ADD COLUMN {nome} {tipo}
                """
            )

            print(
                f"✅ Coluna criada: {nome}"
            )

        except sqlite3.OperationalError as erro:
            if "duplicate column name" not in str(erro):
                print(
                    f"Erro ao criar {nome}:",
                    erro
                    )

    conexao.commit()

    conexao.close()

criar_tabela()

criar_tabela_orcamentos()

atualizar_banco()