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

            // =======================================================
            // CORREÇÃO: Alterado de 'pantry' para 'estoque'
            // =======================================================
            res.render('estoque', { 
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
                // =======================================================
                // MELHORIA: Usando flash message
                // =======================================================
                req.flash('error', 'Todos os campos são obrigatórios.');
                return res.redirect('/estoque');
            }

            await pantryItemModel.addItem(userId, ingredientId, quantity, unit);
            // =======================================================
            // MELHORIA: Usando flash message
            // =======================================================
            req.flash('success', 'Item adicionado ao estoque!');
            res.redirect('/estoque'); // Recarrega a página de estoque
        } catch (error)
        {
            console.error(error);
            // =======================================================
            // MELHORIA: Usando flash message
            // =======================================================
            req.flash('error', 'Erro ao adicionar item.');
            res.redirect('/estoque');
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
            // =======================================================
            // MELHORIA: Usando flash message
            // =======================================================
            req.flash('success', 'Item removido do estoque.');
            res.redirect('/estoque');
        } catch (error) {
            console.error(error);
            // =======================================================
            // MELHORIA: Usando flash message
            // =======================================================
            req.flash('error', 'Erro ao remover item.');
            res.redirect('/estoque');
        }
    }
    // (Função de Update de quantidade ficaria aqui)
};

module.exports = pantryController;