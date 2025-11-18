const pantryItemModel = require('../models/pantryItemModel');
const ingredientModel = require('../models/ingredientModel');

const pantryController = {

    async showPantry(req, res) {
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.redirect('/login');
            }
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

    async addItem(req, res) {
        try {
            const userId = req.session.userId;
            const { ingredientId, quantity, unit } = req.body;

            if (!userId) {
                return res.status(403).send('Acesso negado.');
            }
            if (!ingredientId || !quantity || !unit) {

                req.flash('error', 'Todos os campos são obrigatórios.');
                return res.redirect('/estoque');
            }

            await pantryItemModel.addItem(userId, ingredientId, quantity, unit);
            req.flash('success', 'Item adicionado ao estoque!');
            res.redirect('/estoque');
        } catch (error)
        {
            console.error(error);

            req.flash('error', 'Erro ao adicionar item.');
            res.redirect('/estoque');
        }
    },

    async deleteItem(req, res) {
        try {
            const pantryItemId = req.params.id;
            const userId = req.session.userId;
            

            if (!userId) {
                return res.status(403).send('Acesso negado.');
            }

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