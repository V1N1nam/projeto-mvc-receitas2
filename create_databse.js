// const mysql = require('mysql2/promise');

// // Configurações de conexão com o servidor MySQL.
// // Note que NÃO especificamos o 'database' aqui, pois ele ainda não existe.
// const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     port: 3309,
//     password: 'root',
//     database: 'Gerenciador_Receitas'
// };
// // const DBNAME = 'Gerenciador_Receitas';

// // // Função assíncrona para criar o banco de dados
// // async function createDatabase() {
// //     let connection;
// //     try {
// //         // 1. Conecta-se ao SERVIDOR MySQL
// //         console.log('Conectando ao servidor MySQL...');
// //         connection = await mysql.createConnection(dbConfig);
// //         console.log('Conexão bem-sucedida!');

// //         // 2. Executa o comando SQL para criar o banco de dados
// //         // Usamos "IF NOT EXISTS" para evitar erros caso o banco já tenha sido criado
// //         console.log(`Criando o banco de dados '${DBNAME}'...`);
// //         await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DBNAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
// //         console.log('Banco de dados criado ou já existente com sucesso!');

// //     } catch (error) {
// //         // Captura e exibe qualquer erro que possa ocorrer
// //         console.error('Ocorreu um erro ao criar o banco de dados:', error);
// //     } finally {
// //         // 3. Fecha a conexão com o servidor
// //         if (connection) {
// //             console.log('Fechando a conexão.');
// //             await connection.end();
// //         }
// //     }
// // }

// // createDatabase();

// async function createTables() {
//     let connection;
//     try {
//         // Conecta ao banco de dados 'Gerenciador_Receitas'
//         connection = await mysql.createConnection(dbConfig);
//         console.log('Conexão com o banco de dados bem-sucedida.');

//         // 1. Tabela de Usuários (Users)
//         console.log('Criando tabela de Usuários...');
//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS Users (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 email VARCHAR(255) NOT NULL UNIQUE,
//                 password VARCHAR(255) NOT NULL,
//                 createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//             );
//         `);
//         console.log('Tabela de Usuários criada com sucesso.');

//         // 2. Tabela de Ingredientes (Ingredients) - A enciclopédia
//         console.log('Criando tabela de Ingredientes...');
//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS Ingredients (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL UNIQUE,
//                 calories DECIMAL(10, 2),
//                 proteins DECIMAL(10, 2),
//                 carbs DECIMAL(10, 2),
//                 fats DECIMAL(10, 2)
//             );
//         `);
//         console.log('Tabela de Ingredientes criada com sucesso.');

//         // 3. Tabela de Receitas (Recipes)
//         console.log('Criando tabela de Receitas...');
//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS Recipes (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 title VARCHAR(255) NOT NULL,
//                 description TEXT,
//                 instructions TEXT NOT NULL,
//                 image_path VARCHAR(255),
//                 userId INT,
//                 FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
//             );
//         `);
//         console.log('Tabela de Receitas criada com sucesso.');
        
//         // 4. Tabela do Estoque Virtual (PantryItems)
//         console.log('Criando tabela do Estoque Virtual...');
//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS PantryItems (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 userId INT,
//                 ingredientId INT,
//                 quantity DECIMAL(10, 2) NOT NULL,
//                 unit VARCHAR(50),
//                 FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
//                 FOREIGN KEY (ingredientId) REFERENCES Ingredients(id) ON DELETE CASCADE
//             );
//         `);
//         console.log('Tabela do Estoque Virtual criada com sucesso.');

//         // 5. Tabela de Junção (Muitos-para-Muitos): Ingredientes em uma Receita
//         console.log('Criando tabela de junção RecipeIngredients...');
//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS RecipeIngredients (
//                 recipeId INT,
//                 ingredientId INT,
//                 quantity DECIMAL(10, 2) NOT NULL,
//                 unit VARCHAR(50) NOT NULL,
//                 PRIMARY KEY (recipeId, ingredientId),
//                 FOREIGN KEY (recipeId) REFERENCES Recipes(id) ON DELETE CASCADE,
//                 FOREIGN KEY (ingredientId) REFERENCES Ingredients(id) ON DELETE CASCADE
//             );
//         `);
//         console.log('Tabela RecipeIngredients criada com sucesso.');

//         console.log('\nTodas as tabelas foram criadas com sucesso!');

//     } catch (error) {
//         console.error('Ocorreu um erro ao criar as tabelas:', error);
//     } finally {
//         if (connection) {
//             await connection.end();
//             console.log('Conexão com o banco de dados fechada.');
//         }
//     }
// }

// // Executa a função
// createTables();

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST, // Pega o host do .env ou usa 'localhost' como padrão.
    user: process.env.DB_USER,      // Pega o usuário do .env ou usa 'root'.
    port: process.env.DB_PORT,        // Pega a porta do .env ou usa 3309.
    password: process.env.DB_PASSWORD, // Pega a senha do .env.
    database: process.env.DB_NAME  // Pega o nome do banco de dados do .env         // Fila de espera ilimitada.
});

// Mensagem para confirmar que o pool foi criado (opcional, bom para depuração)
console.log('Pool de conexões com o MySQL criado com sucesso.');

// Exportamos o 'pool' para que outros arquivos (principalmente os Models) possam usá-lo
// para executar consultas no banco de dados.
module.exports = pool;
