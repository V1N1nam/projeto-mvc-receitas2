const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Importa ambos os middlewares para usar
const { isGuest, isAuthenticated } = require('../middlewares/authMiddleware');

// Mostra a página de registo (só para convidados)
router.get('/cadastro', isGuest, authController.showRegisterPage);

// Processa o formulário de registo
router.post('/cadastro', isGuest, authController.registerUser);

// Mostra a página de login (só para convidados)
router.get('/login', isGuest, authController.showLoginPage);

// Processa o formulário de login
// !! CORRIGIDO AQUI: A função chama-se 'loginUser' no controller !!
router.post('/login', isGuest, authController.loginUser);

// Processa o logout (só para utilizadores logados)
router.get('/logout', isAuthenticated, authController.logoutUser);

module.exports = router;

