const recipeModel = require('../models/recipeModel');
const ingredientModel = require('../models/ingredientModel');
const pantryItemModel = require('../models/pantryItemModel');

const recipeController = {

    async listAll(req, res) {
        try {
            const recipes = await recipeModel.findAll();
             
            res.render('recitas', { recipes, title: 'Receitas' });

        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar receitas.');
        }
    },

    async showCreateForm(req, res) {
        try {
            const ingredients = await ingredientModel.findAll();
            

            res.render('formulario_receitas', { title: 'Nova Receita', ingredients });

        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar o formulário.');
        }
    },

    async create(req, res) {
        try {
            const { title, description, instructions } = req.body;
            const userId = req.session.userId;
            

            const image_path = req.file ? `/uploads/${req.file.filename}` : null;

            const newRecipe = await recipeModel.create(title, description, instructions, image_path, userId);
            
            const { ingredientIds, quantities, units } = req.body;
            if (ingredientIds && quantities && units) {
                const ingredientsArray = Array.isArray(ingredientIds) ? ingredientIds : [ingredientIds];
                const quantitiesArray = Array.isArray(quantities) ? quantities : [quantities];
                const unitsArray = Array.isArray(units) ? units : [units];

                for (let i = 0; i < ingredientsArray.length; i++) {
                    if(ingredientsArray[i] && quantitiesArray[i] && unitsArray[i]) {
                        await recipeModel.addIngredientToRecipe(
                            newRecipe.id, 
                            ingredientsArray[i], 
                            quantitiesArray[i], 
                            unitsArray[i]
                        );
                    }
                }
            }
            res.redirect(`/receitas/${newRecipe.id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao criar receita.');
        }
    },

    async getDetails(req, res) {
        try {
            const recipeId = req.params.id;
            const userId = req.session.userId || null;

            const recipe = await recipeModel.findById(recipeId);
            if (!recipe) {
                return res.status(404).send('Receita não encontrada.');
            }
            
            const recipeIngredients = await recipeModel.findIngredientsByRecipeId(recipeId);
            
            let ingredientsWithStockInfo = recipeIngredients.map(ing => ({ ...ing, inStock: false }));
            if (userId) {
                const pantryItems = await pantryItemModel.findByUserId(userId);
                const pantryMap = new Map();
                pantryItems.forEach(item => pantryMap.set(item.name, item.quantity));

                ingredientsWithStockInfo = recipeIngredients.map(ing => ({
                    ...ing,
                    inStock: pantryMap.has(ing.name) && pantryMap.get(ing.name) >= ing.quantity,
                    needed: ing.quantity,
                    available: pantryMap.get(ing.name) || 0
                }));
            }

            res.render('detalhes_receitas', { 
                recipe, 
                ingredients: ingredientsWithStockInfo, 
                title: recipe.title 
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar detalhes da receita.');
        }
    }
};

module.exports = recipeController;