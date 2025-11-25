const recipeModel = require('../models/recipeModel');
const ingredientModel = require('../models/ingredientModel');
const pantryItemModel = require('../models/pantryItemModel');
const fs = require('fs'); 

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
            
            let pantryUnits = {};
            if (req.session.userId) {
                const pantryItems = await pantryItemModel.findByUserId(req.session.userId);
                pantryItems.forEach(item => {
                    pantryUnits[item.ingredientId] = item.unit;
                });
            }

            res.render('formulario_receitas', { 
                title: 'Nova Receita', 
                ingredients,
                pantryUnits: JSON.stringify(pantryUnits) 
            });

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
            if (ingredientIds) {
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

    async showEditForm(req, res) {
        try {
            const recipeId = req.params.id;
            const userId = req.session.userId;

            const recipe = await recipeModel.findById(recipeId);
            
            if (!recipe) {
                req.flash('error', 'Receita não encontrada.');
                return res.redirect('/receitas');
            }

            if (recipe.userId !== userId) {
                req.flash('error', 'Você não tem permissão para editar esta receita.');
                return res.redirect(`/receitas/${recipeId}`);
            }

            const recipeIngredients = await recipeModel.findIngredientsByRecipeId(recipeId);
            const allIngredients = await ingredientModel.findAll();

            let pantryUnits = {};
            if (userId) {
                const pantryItems = await pantryItemModel.findByUserId(userId);
                pantryItems.forEach(item => {
                    pantryUnits[item.ingredientId] = item.unit;
                });
            }

            res.render('formulario_receitas', { 
                title: 'Editar Receita',
                recipe,
                recipeIngredients, 
                ingredients: allIngredients,
                pantryUnits: JSON.stringify(pantryUnits)
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar formulário de edição.');
        }
    },

    async update(req, res) {
        try {
            const recipeId = req.params.id;
            const userId = req.session.userId;
            const { title, description, instructions } = req.body;

            const recipe = await recipeModel.findById(recipeId);
            if (!recipe || recipe.userId !== userId) {
                return res.status(403).send('Acesso negado.');
            }

            let image_path = recipe.image_path;
            if (req.file) {
                if (image_path) {
                    try {
                        const oldPath = `public${image_path}`;
                        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                    } catch(e) { console.error("Erro ao apagar imagem antiga", e); }
                }
                image_path = `/uploads/${req.file.filename}`;
            }

            await recipeModel.update(recipeId, title, description, instructions, image_path);
            await recipeModel.removeAllIngredientsFromRecipe(recipeId);

            const { ingredientIds, quantities, units } = req.body;
            if (ingredientIds) {
                const ingredientsArray = Array.isArray(ingredientIds) ? ingredientIds : [ingredientIds];
                const quantitiesArray = Array.isArray(quantities) ? quantities : [quantities];
                const unitsArray = Array.isArray(units) ? units : [units];

                for (let i = 0; i < ingredientsArray.length; i++) {
                    if(ingredientsArray[i] && quantitiesArray[i] && unitsArray[i]) {
                        await recipeModel.addIngredientToRecipe(
                            recipeId, 
                            ingredientsArray[i], 
                            quantitiesArray[i], 
                            unitsArray[i]
                        );
                    }
                }
            }

            req.flash('success', 'Receita atualizada com sucesso!');
            res.redirect(`/receitas/${recipeId}`);

        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao atualizar receita.');
            res.redirect(`/receitas/${req.params.id}/editar`);
        }
    },

    async delete(req, res) {
        try {
            const recipeId = req.params.id;
            const userId = req.session.userId;

            const recipe = await recipeModel.findById(recipeId);
            if (!recipe) {
                req.flash('error', 'Receita não encontrada.');
                return res.redirect('/receitas');
            }
            if (recipe.userId !== userId) {
                req.flash('error', 'Você não tem permissão para excluir esta receita.');
                return res.redirect(`/receitas/${recipeId}`);
            }

            if (recipe.image_path) {
                try {
                    const fullPath = `public${recipe.image_path}`;
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                } catch(e) { console.error("Erro ao apagar imagem", e); }
            }

            await recipeModel.delete(recipeId);
            req.flash('success', 'Receita excluída com sucesso!');
            res.redirect('/receitas');

        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao excluir receita.');
            res.redirect('/receitas');
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