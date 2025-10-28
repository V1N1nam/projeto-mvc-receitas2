const mysql = require('mysql2/promise');
require('dotenv').config(); // Carrega as variáveis do .env

// Configurações de conexão, AGORA com o banco de dados especificado
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    port: process.env.DB_PORT || 3309,
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'Gerenciador_Receitas' // <-- ESSENCIAL
};

// Função principal assíncrona para criar as tabelas
async function createTables() {
    let connection;
    try {
        // Conecta ao banco de dados 'Gerenciador_Receitas'
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados bem-sucedida.');

        // 1. Tabela de Usuários (Users)
        console.log('Criando tabela de Usuários...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabela de Usuários criada com sucesso.');

        // 2. Tabela de Ingredientes (Ingredients) - A enciclopédia
        console.log('Criando tabela de Ingredientes...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Ingredients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                calories DECIMAL(10, 2),
                proteins DECIMAL(10, 2),
                carbs DECIMAL(10, 2),
                fats DECIMAL(10, 2)
            );
        `);
        console.log('Tabela de Ingredientes criada com sucesso.');

        // 3. Tabela de Receitas (Recipes)
        console.log('Criando tabela de Receitas...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Recipes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                instructions TEXT NOT NULL,
                image_path VARCHAR(255),
                userId INT,
                FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabela de Receitas criada com sucesso.');
        
        // 4. Tabela do Estoque Virtual (PantryItems)
        console.log('Criando tabela do Estoque Virtual...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS PantryItems (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT,
                ingredientId INT,
                quantity DECIMAL(10, 2) NOT NULL,
                unit VARCHAR(50),
                FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (ingredientId) REFERENCES Ingredients(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabela do Estoque Virtual criada com sucesso.');

        // 5. Tabela de Junção (Muitos-para-Muitos): Ingredientes em uma Receita
        console.log('Criando tabela de junção RecipeIngredients...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS RecipeIngredients (
                recipeId INT,
                ingredientId INT,
                quantity DECIMAL(10, 2) NOT NULL,
                unit VARCHAR(50) NOT NULL,
                PRIMARY KEY (recipeId, ingredientId),
                FOREIGN KEY (recipeId) REFERENCES Recipes(id) ON DELETE CASCADE,
                FOREIGN KEY (ingredientId) REFERENCES Ingredients(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabela RecipeIngredients criada com sucesso.');

        console.log('\nTodas as tabelas foram criadas com sucesso!');

    } catch (error) {
        console.error('Ocorreu um erro ao criar as tabelas:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Conexão com o banco de dados fechada.');
        }
    }
}

// Executa a função
createTables();

