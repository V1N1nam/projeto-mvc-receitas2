// Importamos o Express para usar o Router.
const express = require('express');
// Criamos uma instância do Router.
const router = express.Router();
// Importamos o nosso controller de autenticação.
// Ele vai procurar pelo objeto exportado no arquivo 'authController.js'.
const authController = require('../controllers/authController');

// ROTA PARA EXIBIR A PÁGINA DE CADASTRO
// A segunda parte, 'authController.showRegisterPage', DEVE ser uma função.
// Se não for, o erro 'handler must be a function' acontece aqui.
router.get('/cadastro', authController.showRegisterPage);

// ROTA PARA PROCESSAR O FORMULÁRIO DE CADASTRO
router.post('/cadastro', authController.registerUser);

// ROTA PARA EXIBIR A PÁGINA DE LOGIN
router.get('/login', authController.showLoginPage);

// ROTA PARA PROCESSAR O LOGIN
router.post('/login', authController.processLogin);

// Exportamos o router para que ele possa ser usado no app.js.
module.exports = router;
