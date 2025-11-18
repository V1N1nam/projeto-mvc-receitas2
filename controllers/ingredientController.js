const ingredientModel = require('../models/ingredientModel');

const ingredientController = {

    async listAll(req, res) {
        try {
            const ingredients = await ingredientModel.findAll();
            

            res.render('lista_ingredientes', { ingredients, title: 'Ingredientes' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar ingredientes.');
        }
    },

    showCreateForm(req, res) {

        res.render('formularios_ingredientes', { title: 'Novo Ingrediente' });
    },

    async create(req, res) {
        try {
            const { name, calories, proteins, carbs, fats } = req.body;
            await ingredientModel.create(name, calories, proteins, carbs, fats);
            res.redirect('/ingredientes'); 
        } catch (error) {
            console.error(error);

            res.render('formularios_ingredientes', { error: 'Erro ao criar ingrediente.' });
        }
    },
    
};

module.exports = ingredientController;