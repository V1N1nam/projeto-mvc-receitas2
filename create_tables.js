const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'Gerenciador_Receitas'
};

async function createTables() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados bem-sucedida.');

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

createTables();

