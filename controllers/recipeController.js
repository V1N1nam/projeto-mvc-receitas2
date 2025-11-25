const recipeModel = require('../models/recipeModel');
const ingredientModel = require('../models/ingredientModel');
const pantryItemModel = require('../models/pantryItemModel');
const fs = require('fs');

const recipeController = {


    async downloadRecipe(req, res) {
        try {
            const { id } = req.params;
            const recipe = await recipeModel.findById(id);
            
            if (!recipe) return res.status(404).send('Receita não encontrada.');

            const ingredients = await recipeModel.findIngredientsByRecipeId(id);

            let content = `RECEITA: ${recipe.title.toUpperCase()}\n`;
            content += `====================================\n\n`;
            content += `DESCRIÇÃO:\n${recipe.description}\n\n`;
            content += `INGREDIENTES:\n`;
            
            ingredients.forEach(ing => {
                content += `- ${ing.quantity} ${ing.unit} de ${ing.name}\n`;
            });

            content += `\nMODO DE PREPARO:\n`;
            content += `${recipe.instructions}\n`;
            content += `\n\nGerado por Receitas.io`;

            res.setHeader('Content-disposition', `attachment; filename=${recipe.title.replace(/ /g, '_')}.txt`);
            res.setHeader('Content-type', 'text/plain');

            res.send(content);

        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao gerar download.');
        }
    },


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
            res.status(500).send('Erro ao carregar formulário.');
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
                const ids = Array.isArray(ingredientIds) ? ingredientIds : [ingredientIds];
                const qtds = Array.isArray(quantities) ? quantities : [quantities];
                const uns = Array.isArray(units) ? units : [units];

                for (let i = 0; i < ids.length; i++) {
                    if(ids[i] && qtds[i] && uns[i]) {
                        await recipeModel.addIngredientToRecipe(newRecipe.id, ids[i], qtds[i], uns[i]);
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
            res.status(500).send('Erro ao carregar edição.');
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
                    } catch(e) { console.error(e); }
                }
                image_path = `/uploads/${req.file.filename}`;
            }

            await recipeModel.update(recipeId, title, description, instructions, image_path);
            await recipeModel.removeAllIngredientsFromRecipe(recipeId);

            const { ingredientIds, quantities, units } = req.body;
            if (ingredientIds) {
                const ids = Array.isArray(ingredientIds) ? ingredientIds : [ingredientIds];
                const qtds = Array.isArray(quantities) ? quantities : [quantities];
                const uns = Array.isArray(units) ? units : [units];

                for (let i = 0; i < ids.length; i++) {
                    if(ids[i] && qtds[i] && uns[i]) {
                        await recipeModel.addIngredientToRecipe(recipeId, ids[i], qtds[i], uns[i]);
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
                req.flash('error', 'Sem permissão.');
                return res.redirect(`/receitas/${recipeId}`);
            }

            if (recipe.image_path) {
                try {
                    const fullPath = `public${recipe.image_path}`;
                    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
                } catch(e) { console.error(e); }
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
            if (!recipe) return res.status(404).send('Receita não encontrada.');
            
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
            res.status(500).send('Erro ao carregar detalhes.');
        }
    }
};

module.exports = recipeController;