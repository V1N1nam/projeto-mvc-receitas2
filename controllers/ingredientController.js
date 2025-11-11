const ingredientModel = require('../models/ingredientModel');

// Este controller gere o CRUD da "enciclopédia" de ingredientes
const ingredientController = {

    // Lista todos os ingredientes 
    async listAll(req, res) {
        try {
            const ingredients = await ingredientModel.findAll();
            
            // =======================================================
            // CORREÇÃO: Alterado de 'ingredientes/list' para 'lista_ingredientes'
            // =======================================================
            res.render('lista_ingredientes', { ingredients, title: 'Ingredientes' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar ingredientes.');
        }
    },

    // Mostra o formulário para criar um novo ingrediente
    showCreateForm(req, res) {
        
        // =======================================================
        // CORREÇÃO: Alterado de 'ingredientes/form' para 'formularios_ingredientes'
        // =======================================================
        res.render('formularios_ingredientes', { title: 'Novo Ingrediente' });
    },

    // Processa a criação do novo ingrediente
    async create(req, res) {
        try {
            const { name, calories, proteins, carbs, fats } = req.body;
            await ingredientModel.create(name, calories, proteins, carbs, fats);
            res.redirect('/ingredientes'); // Redireciona para a lista
        } catch (error) {
            console.error(error);
            // =======================================================
            // CORREÇÃO: Apontando para o formulário correto em caso de erro
            // =======================================================
            res.render('formularios_ingredientes', { error: 'Erro ao criar ingrediente.' });
        }
    },
    
    // (Funções para Editar e Apagar seguiriam o mesmo padrão)
};

// EXPORTA O CONTROLADOR CORRETO
module.exports = ingredientController;