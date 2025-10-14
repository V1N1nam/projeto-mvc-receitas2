// Importamos o nosso modelo de usuário para acessar o banco de dados.
// Certifique-se de que o caminho para o seu userModel está correto.
// const userModel = require('../models/userModel');
// Importamos o bcrypt para criptografar e comparar senhas.
// const bcrypt = require('bcryptjs');

// O 'authController' é um objeto que agrupa todas as funções lógicas de autenticação.
// Cada propriedade deste objeto DEVE ser uma função.
const authController = {

    // Função para renderizar (mostrar) a página de cadastro.
    showRegisterPage(req, res) {
        // 'res.render' usa o EJS para gerar o HTML da página de registro.
        // Certifique-se que o arquivo 'register.ejs' existe na pasta 'views'.
        res.render('register', { title: 'Cadastro' });
    },

    // Função para processar os dados do formulário de cadastro (a ser implementada).
    registerUser(req, res) {
        // A lógica de cadastro (validar, criptografar, salvar) virá aqui.
        res.send('Usuário será registrado aqui.');
    },

    // Função para mostrar a página de login.
    showLoginPage(req, res) {
        // Certifique-se que o arquivo 'login.ejs' existe na pasta 'views'.
        res.render('login', { title: 'Login' });
    },

    // Função para processar o login (a ser implementada).
    processLogin(req, res) {
        res.send('Lógica de login será implementada aqui.');
    }
};

// Esta linha é a mais importante.
// Ela exporta o objeto 'authController' com todas as suas funções.
// Se esta linha faltar, o authRoutes.js receberá 'undefined'.
module.exports = authController;
