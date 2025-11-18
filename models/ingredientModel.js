const pool = require('../config/database');

const ingredientModel = {
    async create(name, calories, proteins, carbs, fats) {
        try {
            const query = 'INSERT INTO Ingredients (name, calories, proteins, carbs, fats) VALUES (?, ?, ?, ?, ?)';
            const [result] = await pool.query(query, [name, calories, proteins, carbs, fats]);
            return { id: result.insertId, name };
        } catch (error) {
            console.error('Erro ao criar ingrediente:', error);
            throw error;
        }
    },

    async findAll() {
        try {
            const query = 'SELECT * FROM Ingredients ORDER BY name';
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Erro ao listar ingredientes:', error);
            throw error;
        }
    },

    async findById(id) {
        try {
            const query = 'SELECT * FROM Ingredients WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar ingrediente por ID:', error);
            throw error;
        }
    },

    async update(id, name, calories, proteins, carbs, fats) {
        try {
            const query = `
                UPDATE Ingredients 
                SET name = ?, calories = ?, proteins = ?, carbs = ?, fats = ?
                WHERE id = ?
            `;
            await pool.query(query, [name, calories, proteins, carbs, fats, id]);
            return { id, name };
        } catch (error) {
            console.error('Erro ao atualizar ingrediente:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const query = 'DELETE FROM Ingredients WHERE id = ?';
            await pool.query(query, [id]);
            return { message: 'Ingrediente removido com sucesso' };
        } catch (error) {
            console.error('Erro ao remover ingrediente:', error);
            throw error;
        }
    }
};

module.exports = ingredientModel;
