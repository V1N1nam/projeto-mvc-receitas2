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
            req.flash('success', 'Ingrediente criado com sucesso!');
            res.redirect('/ingredientes');
        } catch (error) {
            console.error(error);
            res.render('formularios_ingredientes', { error: 'Erro ao criar ingrediente.' });
        }
    },

    async showEditForm(req, res) {
        try {
            const { id } = req.params;
            const ingredient = await ingredientModel.findById(id);

            if (!ingredient) {
                req.flash('error', 'Ingrediente não encontrado.');
                return res.redirect('/ingredientes');
            }

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