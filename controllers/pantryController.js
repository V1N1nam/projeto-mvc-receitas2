const pantryItemModel = require('../models/pantryItemModel');
const ingredientModel = require('../models/ingredientModel');

const pantryController = {

    // Mostra o estoque
    async showPantry(req, res) {
        try {
            const userId = req.session.userId;
            if (!userId) return res.redirect('/login');
            
            const pantryItems = await pantryItemModel.findByUserId(userId);
            const ingredients = await ingredientModel.findAll();

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

    // Adiciona item
    async addItem(req, res) {
        try {
            const userId = req.session.userId;
            const { ingredientId, quantity, unit } = req.body;

            if (!userId) return res.status(403).send('Acesso negado.');
            
            if (!ingredientId || !quantity || !unit) {
                req.flash('error', 'Todos os campos são obrigatórios.');
                return res.redirect('/estoque');
            }

            await pantryItemModel.addItem(userId, ingredientId, quantity, unit);
            req.flash('success', 'Item adicionado ao estoque!');
            res.redirect('/estoque');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao adicionar item.');
            res.redirect('/estoque');
        }
    },

    // --- ATUALIZADO: Atualizar Item Completo ---
    async updateItem(req, res) {
        try {
            const userId = req.session.userId;
            const { id } = req.params;
            const { quantity, unit } = req.body; // Agora pega a unidade também

            if (!userId) return res.status(403).send('Acesso negado.');

            // Chama o método genérico 'update'
            await pantryItemModel.update(id, quantity, unit);
            
            req.flash('success', 'Item atualizado com sucesso!');
            res.redirect('/estoque');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao atualizar item.');
            res.redirect('/estoque');
        }
    },

    // Remove item
    async deleteItem(req, res) {
        try {
            const pantryItemId = req.params.id;
            const userId = req.session.userId;

            if (!userId) return res.status(403).send('Acesso negado.');

            await pantryItemModel.delete(pantryItemId);
            req.flash('success', 'Item removido do estoque.');
            res.redirect('/estoque');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao remover item.');
            res.redirect('/estoque');
        }
    }
};

module.exports = pantryController;