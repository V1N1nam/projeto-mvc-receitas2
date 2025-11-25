const pool = require('../config/database');

const pantryItemModel = {
    async addItem(userId, ingredientId, quantity, unit) {
        try {
            const checkQuery = 'SELECT * FROM PantryItems WHERE userId = ? AND ingredientId = ?';
            const [existing] = await pool.query(checkQuery, [userId, ingredientId]);

            if (existing.length > 0) {
                const updateQuery = 'UPDATE PantryItems SET quantity = quantity + ? WHERE id = ?';
                await pool.query(updateQuery, [quantity, existing[0].id]);
                return { id: existing[0].id };
            } else {
                const insertQuery = 'INSERT INTO PantryItems (userId, ingredientId, quantity, unit) VALUES (?, ?, ?, ?)';
                const [result] = await pool.query(insertQuery, [userId, ingredientId, quantity, unit]);
                return { id: result.insertId };
            }
        } catch (error) {
            console.error('Erro ao adicionar item ao estoque:', error);
            throw error;
        }
    },

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

    async update(id, quantity, unit) {
        try {
            const query = 'UPDATE PantryItems SET quantity = ?, unit = ? WHERE id = ?';
            await pool.query(query, [quantity, unit, id]);
            return { id };
        } catch (error) {
            console.error('Erro ao atualizar item do estoque:', error);
            throw error;
        }
    },

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