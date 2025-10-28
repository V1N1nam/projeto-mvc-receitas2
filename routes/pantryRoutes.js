const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Todas as rotas de estoque exigem autenticação
router.use(isAuthenticated);

// Mostra o estoque do utilizador (ex: /estoque)
router.get('/', pantryController.showPantry);

// Adiciona um item ao estoque (ex: POST /estoque/adicionar)
router.post('/adicionar', pantryController.addItem);

// Remove um item do estoque (ex: GET /estoque/remover/5)
// Nota: Um POST ou DELETE seria semanticamente melhor, mas GET é mais simples para links
router.get('/remover/:id', pantryController.deleteItem); 

module.exports = router;
