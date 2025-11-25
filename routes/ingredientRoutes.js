const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.use(isAuthenticated);

router.get('/', ingredientController.listAll);

router.get('/novo', ingredientController.showCreateForm);
router.post('/novo', ingredientController.create);

router.get('/:id/editar', ingredientController.showEditForm);
router.post('/:id/editar', ingredientController.update);      

router.get('/remover/:id', ingredientController.delete);

module.exports = router;