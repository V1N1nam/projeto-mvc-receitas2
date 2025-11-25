const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.use(isAuthenticated);

router.get('/', pantryController.showPantry);

router.post('/adicionar', pantryController.addItem);

router.post('/atualizar/:id', pantryController.updateItem);

router.get('/remover/:id', pantryController.deleteItem); 

module.exports = router;