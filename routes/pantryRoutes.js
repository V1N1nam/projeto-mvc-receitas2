const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Todas as rotas de estoque exigem autenticação
router.use(isAuthenticated);

// Listar
router.get('/', pantryController.showPantry);

// Adicionar
router.post('/adicionar', pantryController.addItem);

// --- NOVA ROTA: Atualizar Item ---
router.post('/atualizar/:id', pantryController.updateItem);

// Remover
router.get('/remover/:id', pantryController.deleteItem); 

module.exports = router;