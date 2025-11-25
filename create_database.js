const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || 'root'
};

const dbName = process.env.DB_NAME || 'Gerenciador_Receitas';

async function createDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexão ao servidor MySQL estabelecida.');


        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

        console.log(`Banco de dados '${dbName}' criado ou já existente.`);

    } catch (error) {
        console.error('Erro ao criar o banco de dados:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Conexão fechada.');
        }
    }
}

createDatabase();

