const ingredientModel = require('../models/ingredientModel');

// Este controller gere o CRUD da "enciclopédia" de ingredientes
const ingredientController = {

    // Lista todos os ingredientes
    async listAll(req, res) {
        try {
            const ingredients = await ingredientModel.findAll();
            // Assegure-se de que tem uma view em 'views/ingredients/list.ejs'
            res.render('ingredients/list', { ingredients, title: 'Ingredientes' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar ingredientes.');
        }
    },

    // Mostra o formulário para criar um novo ingrediente
    showCreateForm(req, res) {
        // Assegure-se de que tem uma view em 'views/ingredients/form.ejs'
        res.render('ingredients/form', { title: 'Novo Ingrediente' });
    },

    // Processa a criação do novo ingrediente
    async create(req, res) {
        try {
            const { name, calories, proteins, carbs, fats } = req.body;
            await ingredientModel.create(name, calories, proteins, carbs, fats);
            res.redirect('/ingredientes'); // Redireciona para a lista
        } catch (error) {
            console.error(error);
            res.render('ingredients/form', { error: 'Erro ao criar ingrediente.' });
        }
    },
    
    // (Funções para Editar e Apagar seguiriam o mesmo padrão)
};

// EXPORTA O CONTROLADOR CORRETO
module.exports = ingredientController;

