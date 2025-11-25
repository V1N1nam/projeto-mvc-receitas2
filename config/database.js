const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    port: process.env.DB_PORT || 3309,
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'Gerenciador_Receitas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('Pool de conexões com o MySQL pronto para uso.');

module.exports = pool;

