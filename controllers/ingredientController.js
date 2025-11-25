const ingredientModel = require('../models/ingredientModel');

const ingredientController = {

    // Lista todos os ingredientes
    async listAll(req, res) {
        try {
            const ingredients = await ingredientModel.findAll();
            res.render('lista_ingredientes', { ingredients, title: 'Ingredientes' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar ingredientes.');
        }
    },

    // Mostra o formulário de criação
    showCreateForm(req, res) {
        res.render('formularios_ingredientes', { title: 'Novo Ingrediente' });
    },

    // Processa a criação
    async create(req, res) {
        try {
            const { name, calories, proteins, carbs, fats } = req.body;
            await ingredientModel.create(name, calories, proteins, carbs, fats);
            req.flash('success', 'Ingrediente criado com sucesso!');
            res.redirect('/ingredientes');
        } catch (error) {
            console.error(error);
            res.render('formularios_ingredientes', { error: 'Erro ao criar ingrediente.' });
        }
    },

    // --- NOVAS FUNÇÕES PARA EDITAR ---

    // 1. Mostra o formulário preenchido para edição
    async showEditForm(req, res) {
        try {
            const { id } = req.params;
            const ingredient = await ingredientModel.findById(id);

            if (!ingredient) {
                req.flash('error', 'Ingrediente não encontrado.');
                return res.redirect('/ingredientes');
            }

            // Renderiza a mesma view, mas agora passando o objeto 'ingredient'
            res.render('formularios_ingredientes', { 
                title: 'Editar Ingrediente', 
                ingredient: ingredient 
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao carregar formulário de edição.');
            res.redirect('/ingredientes');
        }
    },

    // 2. Processa a atualização dos dados
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, calories, proteins, carbs, fats } = req.body;
            
            await ingredientModel.update(id, name, calories, proteins, carbs, fats);
            
            req.flash('success', 'Ingrediente atualizado com sucesso!');
            res.redirect('/ingredientes');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao atualizar ingrediente.');
            res.redirect('/ingredientes');
        }
    },

    // --- FIM DAS NOVAS FUNÇÕES ---

    // Excluir Ingrediente
    async delete(req, res) {
        try {
            const { id } = req.params;
            await ingredientModel.delete(id);
            req.flash('success', 'Ingrediente excluído com sucesso!');
            res.redirect('/ingredientes');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao excluir ingrediente. Ele pode estar a ser usado numa receita.');
            res.redirect('/ingredientes');
        }
    }
};

module.exports = ingredientController;