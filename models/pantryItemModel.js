// Importa o pool de conexões
const pool = require('../config/database');

const pantryItemModel = {
    // Adiciona um item ao estoque de um utilizador
    async addItem(userId, ingredientId, quantity, unit) {
        try {
            // Verifica se o item já existe para este utilizador
            const checkQuery = 'SELECT * FROM PantryItems WHERE userId = ? AND ingredientId = ?';
            const [existing] = await pool.query(checkQuery, [userId, ingredientId]);

            if (existing.length > 0) {
                // Se existe, atualiza a quantidade (soma)
                const updateQuery = 'UPDATE PantryItems SET quantity = quantity + ? WHERE id = ?';
                await pool.query(updateQuery, [quantity, existing[0].id]);
                return { id: existing[0].id };
            } else {
                // Se não existe, insere um novo
                const insertQuery = 'INSERT INTO PantryItems (userId, ingredientId, quantity, unit) VALUES (?, ?, ?, ?)';
                const [result] = await pool.query(insertQuery, [userId, ingredientId, quantity, unit]);
                return { id: result.insertId };
            }
        } catch (error) {
            console.error('Erro ao adicionar item ao estoque:', error);
            throw error;
        }
    },

    // Lista todos os itens no estoque de um utilizador
    async findByUserId(userId) {
        try {
            const query = `
                SELECT i.name, p.quantity, p.unit, p.id
                FROM PantryItems p
                JOIN Ingredients i ON p.ingredientId = i.id
                WHERE p.userId = ?
            `;
            const [rows] = await pool.query(query, [userId]);
            return rows;
        } catch (error) {
            console.error('Erro ao listar estoque do utilizador:', error);
            throw error;
        }
    },

    // Atualiza a quantidade de um item específico no estoque
    async updateQuantity(pantryItemId, newQuantity) {
        try {
            const query = 'UPDATE PantryItems SET quantity = ? WHERE id = ?';
            await pool.query(query, [newQuantity, pantryItemId]);
            return { id: pantryItemId };
        } catch (error) {
            console.error('Erro ao atualizar quantidade do estoque:', error);
            throw error;
        }
    },

    // Remove um item do estoque
    async delete(pantryItemId) {
        try {
            const query = 'DELETE FROM PantryItems WHERE id = ?';
            await pool.query(query, [pantryItemId]);
            return { message: 'Item removido do estoque' };
        } catch (error) {
            console.error('Erro ao remover item do estoque:', error);
            throw error;
        }
    }
};

module.exports = pantryItemModel;
