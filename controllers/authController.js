const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const authController = {

    // Mostra a página de registo
    showRegisterPage(req, res) {
        // A página de registo agora irá buscar mensagens de erro do flash
        res.render('registro', { title: 'Registo' });
    },

    // Processa o formulário de registo
    async registerUser(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                // 1. Define a mensagem de erro
                req.flash('error', 'Todos os campos são obrigatórios.');
                // 2. Redireciona de volta para a página de registo
                return res.redirect('/cadastro');
            }
            
            const existingUser = await userModel.findByEmail(email);
            if (existingUser) {
                req.flash('error', 'Este e-mail já está em uso.');
                return res.redirect('/cadastro');
            }
            
            await userModel.create(name, email, password);

            // Adiciona uma mensagem de sucesso!
            req.flash('success', 'Conta criada com sucesso! Por favor, faça login.');
            res.redirect('/login');

        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao criar conta.');
            res.redirect('/cadastro');
        }
    },

    // Mostra a página de login
    showLoginPage(req, res) {
        // A página de login agora irá buscar mensagens de erro do flash
        res.render('login', { title: 'Login' });
    },

    // Processa o formulário de login
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                req.flash('error', 'Todos os campos são obrigatórios.');
                return res.redirect('/login');
            }
            
            const user = await userModel.findByEmail(email);
            if (!user) {
                req.flash('error', 'E-mail ou senha inválidos.');
                return res.redirect('/login');
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                req.flash('error', 'E-mail ou senha inválidos.');
                return res.redirect('/login');
            }
            
            req.session.userId = user.id;
            req.session.userName = user.name;
            
            // Adiciona uma mensagem de sucesso ao fazer login (opcional)
            req.flash('success', `Bem-vindo de volta, ${user.name}!`);
            res.redirect('/dashboard');

        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao fazer login.');
            res.redirect('/login');
        }
    },

    // Faz logout do utilizador
    logoutUser(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/dashboard');
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    }
};

module.exports = authController;