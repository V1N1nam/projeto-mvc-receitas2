// Importa a biblioteca 'mysql2' na sua versão com 'promises'
const mysql = require('mysql2/promise');
// Importa 'dotenv' para carregar as variáveis de ambiente
require('dotenv').config();

// Configurações de conexão SEM especificar um 'database',
// pois o objetivo é justamente criar um.
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    port: process.env.DB_PORT || 3309,
    password: process.env.DB_PASSWORD || 'root'
};

const dbName = process.env.DB_NAME || 'Gerenciador_Receitas';

async function createDatabase() {
    let connection;
    try {
        // 1. Conecta-se ao SERVIDOR MySQL (sem banco de dados)
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexão ao servidor MySQL estabelecida.');

        // 2. Executa o comando SQL para criar o banco de dados
        // 'IF NOT EXISTS' evita erros caso o banco já tenha sido criado
        // Adicionado CHARACTER SET para suportar acentos
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

        console.log(`Banco de dados '${dbName}' criado ou já existente.`);

    } catch (error) {
        console.error('Erro ao criar o banco de dados:', error);
    } finally {
        // 3. Fecha a conexão em qualquer caso
        if (connection) {
            await connection.end();
            console.log('Conexão fechada.');
        }
    }
}

// Executa a função
createDatabase();

