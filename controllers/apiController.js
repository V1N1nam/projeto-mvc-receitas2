const recipeModel = require('../models/recipeModel');
const ingredientModel = require('../models/ingredientModel');

const apiController = {

    // --- RECEITAS ---

    // GET /api/receitas
    async getAllRecipes(req, res) {
        try {
            const recipes = await recipeModel.findAll();
            res.json({ success: true, count: recipes.length, data: recipes });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Erro ao buscar receitas' });
        }
    },

    // GET /api/receitas/:id
    async getRecipeById(req, res) {
        try {
            const { id } = req.params;
            const recipe = await recipeModel.findById(id);
            
            if (!recipe) {
                return res.status(404).json({ success: false, error: 'Receita não encontrada' });
            }

            const ingredients = await recipeModel.findIngredientsByRecipeId(id);
            
            // Combina os dados da receita com os ingredientes
            const fullRecipe = { ...recipe, ingredients };

            res.json({ success: true, data: fullRecipe });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Erro ao buscar detalhes da receita' });
        }
    },

    // POST /api/receitas
    async createRecipe(req, res) {
        try {
            const { title, description, instructions, userId } = req.body;
            
            if (!title || !instructions || !userId) {
                return res.status(400).json({ success: false, error: 'Campos obrigatórios: title, instructions, userId' });
            }

            const image_path = null; 

            const newRecipe = await recipeModel.create(title, description, instructions, image_path, userId);
            
            res.status(201).json({ success: true, message: 'Receita criada', data: newRecipe });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Erro ao criar receita' });
        }
    },

    // DELETE /api/receitas/:id
    async deleteRecipe(req, res) {
        try {
            const { id } = req.params;
            
            const recipe = await recipeModel.findById(id);
            if (!recipe) {
                return res.status(404).json({ success: false, error: 'Receita não encontrada' });
            }

            await recipeModel.delete(id);
            res.json({ success: true, message: 'Receita excluída com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Erro ao excluir receita' });
        }
    },

    // --- INGREDIENTES ---

    // GET /api/ingredientes
    async getAllIngredients(req, res) {
        try {
            const ingredients = await ingredientModel.findAll();
            res.json({ success: true, count: ingredients.length, data: ingredients });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Erro ao buscar ingredientes' });
        }
    },

    // POST /api/ingredientes
    async createIngredient(req, res) {
        try {
            const { name, calories, proteins, carbs, fats } = req.body;
            
            if (!name) {
                return res.status(400).json({ success: false, error: 'Nome é obrigatório' });
            }

            const newIngredient = await ingredientModel.create(name, calories, proteins, carbs, fats);
            res.status(201).json({ success: true, message: 'Ingrediente criado', data: newIngredient });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Erro ao criar ingrediente' });
        }
    }
};

module.exports = apiController;