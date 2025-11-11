const recipeModel = require('../models/recipeModel');
const ingredientModel = require('../models/ingredientModel');
const pantryItemModel = require('../models/pantryItemModel');

// O controller mais complexo, pois gere receitas e os seus ingredientes
const recipeController = {

    // Lista todas as receitas
    async listAll(req, res) {
        try {
            const recipes = await recipeModel.findAll();
             
            // CORREÇÃO: Alterado de 'recipes/list' para 'recitas'
            // para corresponder ao nome do seu arquivo EJS.
            res.render('recitas', { recipes, title: 'Receitas' });

        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar receitas.');
        }
    },

    // Mostra o formulário de criação de receita
    async showCreateForm(req, res) {
        try {
            // Para criar uma receita, precisamos da lista de todos os ingredientes
            const ingredients = await ingredientModel.findAll();
            
            // ASSUMINDO: Que o seu formulário se chama 'formulario_receitas.ejs'
            // Se o nome for 'recipes/form.ejs' (como no controller de ingredientes),
            // esta linha também precisará de ser ajustada.
            res.render('formulario_receitas', { title: 'Nova Receita', ingredients });

        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar o formulário.');
        }
    },

    // Processa a criação da receita
    async create(req, res) {
        try {
            const { title, description, instructions } = req.body;
            const userId = req.session.userId; // Pega o ID do utilizador da sessão
            
            // Lógica de Upload de Imagem (usando Multer)
            // O 'req.file' é disponibilizado pelo middleware 'upload.single()' na rota
            const image_path = req.file ? `/uploads/${req.file.filename}` : null;

            // 1. Cria a receita base
            const newRecipe = await recipeModel.create(title, description, instructions, image_path, userId);
            
            // 2. Adiciona os ingredientes na receita
            const { ingredientIds, quantities, units } = req.body;
            if (ingredientIds && quantities && units) {
                // Transforma em array se for apenas um
                const ingredientsArray = Array.isArray(ingredientIds) ? ingredientIds : [ingredientIds];
                const quantitiesArray = Array.isArray(quantities) ? quantities : [quantities];
                const unitsArray = Array.isArray(units) ? units : [units];

                for (let i = 0; i < ingredientsArray.length; i++) {
                    // Garante que não está a adicionar campos vazios
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

    // Mostra os detalhes de uma receita
    async getDetails(req, res) {
        try {
            const recipeId = req.params.id;
            const userId = req.session.userId || null; // Pega o ID (ou null se for convidado)

            // 1. Busca a receita
            const recipe = await recipeModel.findById(recipeId);
            if (!recipe) {
                return res.status(404).send('Receita não encontrada.');
            }
            
            // 2. Busca os ingredientes da receita
            const recipeIngredients = await recipeModel.findIngredientsByRecipeId(recipeId);
            
            let ingredientsWithStockInfo = recipeIngredients.map(ing => ({ ...ing, inStock: false }));

            // 3. (Inteligência) Se o utilizador estiver logado, verifica o estoque
            if (userId) {
                const pantryItems = await pantryItemModel.findByUserId(userId);
                const pantryMap = new Map();
                pantryItems.forEach(item => pantryMap.set(item.name, item.quantity));

                // 4. Compara os ingredientes da receita com o estoque
                ingredientsWithStockInfo = recipeIngredients.map(ing => ({
                    ...ing,
                    inStock: pantryMap.has(ing.name) && pantryMap.get(ing.name) >= ing.quantity,
                    needed: ing.quantity,
                    available: pantryMap.get(ing.name) || 0
                }));
            }

            // CORREÇÃO: Apontei para o seu arquivo 'detalhes_receitas.ejs'
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
    // (Funções de Update e Delete ficariam aqui)
};

// EXPORTA O CONTROLADOR CORRETO
module.exports = recipeController;