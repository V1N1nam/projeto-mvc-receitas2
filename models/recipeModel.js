const pool = require('../config/database');

const recipeModel = {
    async create(title, description, instructions, image_path, userId) {
        try {
            const query = `
                INSERT INTO Recipes (title, description, instructions, image_path, userId) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(query, [title, description, instructions, image_path, userId]);
            return { id: result.insertId, title };
        } catch (error) {
            console.error('Erro ao criar receita:', error);
            throw error;
        }
    },

    async update(id, title, description, instructions, image_path) {
        try {
            const query = `
                UPDATE Recipes 
                SET title = ?, description = ?, instructions = ?, image_path = ?
                WHERE id = ?
            `;
            await pool.query(query, [title, description, instructions, image_path, id]);
            return { id };
        } catch (error) {
            console.error('Erro ao atualizar receita:', error);
            throw error;
        }
    },

    async removeAllIngredientsFromRecipe(recipeId) {
        try {
            const query = 'DELETE FROM RecipeIngredients WHERE recipeId = ?';
            await pool.query(query, [recipeId]);
        } catch (error) {
            console.error('Erro ao limpar ingredientes da receita:', error);
            throw error;
        }
    },

    async addIngredientToRecipe(recipeId, ingredientId, quantity, unit) {
        try {
            const query = `
                INSERT INTO RecipeIngredients (recipeId, ingredientId, quantity, unit) 
                VALUES (?, ?, ?, ?)
            `;
            await pool.query(query, [recipeId, ingredientId, quantity, unit]);
            return { message: 'Ingrediente adicionado à receita' };
        } catch (error) {
            console.error('Erro ao adicionar ingrediente na receita:', error);
            throw error;
        }
    },

    async findAll() {
        try {
            const query = 'SELECT * FROM Recipes ORDER BY id DESC';
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Erro ao listar receitas:', error);
            throw error;
        }
    },

    async findById(id) {
        
        try {
            const query = 'SELECT * FROM Recipes WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar receita por ID:', error);
            throw error;
        }
    },


    async findIngredientsByRecipeId(recipeId) {
        try {
            const query = `
                SELECT i.name, ri.quantity, ri.unit, i.calories, i.proteins, i.carbs, i.fats, ri.ingredientId
                FROM RecipeIngredients ri
                JOIN Ingredients i ON ri.ingredientId = i.id
                WHERE ri.recipeId = ?
            `;
            const [rows] = await pool.query(query, [recipeId]);
            return rows;
        } catch (error) {
            console.error('Erro ao buscar ingredientes da receita:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const query = 'DELETE FROM Recipes WHERE id = ?';
            await pool.query(query, [id]);
            return { message: 'Receita removida com sucesso' };
        } catch (error) {
            console.error('Erro ao remover receita:', error);
            throw error;
        }
    }
};

module.exports = recipeModel;