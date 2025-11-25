const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Todas as rotas de ingredientes exigem autenticação
router.use(isAuthenticated);

// Listar
router.get('/', ingredientController.listAll);

// Criar (Rotas estáticas vêm antes das dinâmicas)
router.get('/novo', ingredientController.showCreateForm);
router.post('/novo', ingredientController.create);

// --- NOVAS ROTAS PARA EDITAR ---
router.get('/:id/editar', ingredientController.showEditForm); // Carrega o formulário
router.post('/:id/editar', ingredientController.update);      // Salva as alterações

// Excluir
router.get('/remover/:id', ingredientController.delete);

module.exports = router;