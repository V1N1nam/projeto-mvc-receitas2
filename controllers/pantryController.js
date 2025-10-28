const pantryItemModel = require('../models/pantryItemModel');
const ingredientModel = require('../models/ingredientModel');

// Gere o estoque (despensa) pessoal de cada utilizador
const pantryController = {

    // Mostra o estoque do utilizador
    async showPantry(req, res) {
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.redirect('/login');
            }
            // Lista os itens do utilizador
            const pantryItems = await pantryItemModel.findByUserId(userId);
            // Lista todos os ingredientes para o formulário de "Adicionar"
            const ingredients = await ingredientModel.findAll();

            res.render('pantry', { 
                pantryItems, 
                ingredients, 
                title: 'Meu Estoque' 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar o estoque.');
        }
    },

    // Adiciona um item ao estoque
    async addItem(req, res) {
        try {
            const userId = req.session.userId;
            const { ingredientId, quantity, unit } = req.body;

            if (!userId) {
                return res.status(403).send('Acesso negado.');
            }
            if (!ingredientId || !quantity || !unit) {
                return res.redirect('/estoque?error=Campos em falta');
            }

            await pantryItemModel.addItem(userId, ingredientId, quantity, unit);
            res.redirect('/estoque'); // Recarrega a página de estoque
        } catch (error)
        {
            console.error(error);
            res.status(500).send('Erro ao adicionar item.');
        }
    },

    // Remove um item do estoque
    async deleteItem(req, res) {
        try {
            const pantryItemId = req.params.id;
            const userId = req.session.userId;
            
            // (Adicionar lógica para verificar se o item pertence ao utilizador)

            if (!userId) {
                return res.status(403).send('Acesso negado.');
            }

            await pantryItemModel.delete(pantryItemId);
            res.redirect('/estoque');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao remover item.');
        }
    }
    // (Função de Update de quantidade ficaria aqui)
};

module.exports = pantryController;
