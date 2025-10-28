const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

// O authController lida especificamente com login, registo e logout.
const authController = {

    // Mostra a página de registo
    showRegisterPage(req, res) {
        // Renderiza o ficheiro ejs de registo
        res.render('register', { title: 'Registo' });
    },

    // Processa o formulário de registo
    async registerUser(req, res) {
        try {
            const { name, email, password } = req.body;
            // Validação simples
            if (!name || !email || !password) {
                return res.render('register', { error: 'Todos os campos são obrigatórios.' });
            }
            // Verifica se o utilizador já existe
            const existingUser = await userModel.findByEmail(email);
            if (existingUser) {
                return res.render('register', { error: 'Este e-mail já está em uso.' });
            }
            // Cria o utilizador (a encriptação é feita no model)
            await userModel.create(name, email, password);
            // Redireciona para a página de login após o sucesso
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.render('register', { error: 'Erro ao criar conta.' });
        }
    },

    // Mostra a página de login
    showLoginPage(req, res) {
        res.render('login', { title: 'Login' });
    },

    // Processa o formulário de login
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.render('login', { error: 'Todos os campos são obrigatórios.' });
            }
            // Encontra o utilizador
            const user = await userModel.findByEmail(email);
            if (!user) {
                return res.render('login', { error: 'E-mail ou senha inválidos.' });
            }
            // Compara a senha
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('login', { error: 'E-mail ou senha inválidos.' });
            }
            // Inicia a sessão (Requer o 'express-session' configurado no app.js)
            req.session.userId = user.id;
            req.session.userName = user.name;
            // Redireciona para a área interna, ex: /dashboard
            res.redirect('/dashboard'); // Crie esta rota!
        } catch (error) {
            console.error(error);
            res.render('login', { error: 'Erro ao fazer login.' });
        }
    },

    // Faz logout do utilizador
    logoutUser(req, res) {
        // Destrói a sessão
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/dashboard'); // Se houver erro, fica na mesma
            }
            // Limpa o cookie e redireciona para a home
            res.clearCookie('connect.sid'); // O nome do cookie pode variar
            res.redirect('/');
        });
    }
};

module.exports = authController;

