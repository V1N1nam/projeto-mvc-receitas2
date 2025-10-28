const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Todas as rotas de ingredientes exigem autenticação
router.use(isAuthenticated);

// Lista todos os ingredientes (ex: /ingredientes)
router.get('/', ingredientController.listAll);

// Mostra o formulário para criar um novo (ex: /ingredientes/novo)
router.get('/novo', ingredientController.showCreateForm);

// Processa a criação do novo ingrediente
router.post('/novo', ingredientController.create);

// (Rotas de update e delete ficariam aqui)

module.exports = router;
