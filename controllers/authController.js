const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const authController = {

    // Exibir formulário de registo
    showRegisterPage(req, res) {
        res.render('registro', { title: 'Registo' });
    },

    // Processar registo
    async registerUser(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                req.flash('error', 'Todos os campos são obrigatórios.');
                return res.redirect('/cadastro');
            }
            
            const existingUser = await userModel.findByEmail(email);
            if (existingUser) {
                req.flash('error', 'Este e-mail já está em uso.');
                return res.redirect('/cadastro');
            }
            
            await userModel.create(name, email, password);

            req.flash('success', 'Conta criada com sucesso! Por favor, faça login.');
            res.redirect('/login');

        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao criar conta.');
            res.redirect('/cadastro');
        }
    },

    // Exibir formulário de login
    showLoginPage(req, res) {
        res.render('login', { title: 'Login' });
    },

    // Processar login (COM A LÓGICA DE LEMBRAR SENHA)
    async loginUser(req, res) {
        try {
            // Captura 'remember' do formulário
            const { email, password, remember } = req.body;

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
            
            // Define a sessão
            req.session.userId = user.id;
            req.session.userName = user.name;

            // Lógica do "Lembrar Senha"
            if (remember) {
                // Se marcado, a sessão dura 30 dias (em milissegundos)
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
            } else {
                // Se não, dura apenas até fechar o navegador
                req.session.cookie.expires = false;
            }
            
            req.flash('success', `Bem-vindo de volta, ${user.name}!`);
            res.redirect('/dashboard');

        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao fazer login.');
            res.redirect('/login');
        }
    },

    // Logout
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