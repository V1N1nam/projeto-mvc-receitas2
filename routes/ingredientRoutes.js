const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.use(isAuthenticated);

router.get('/', ingredientController.listAll);

router.get('/novo', ingredientController.showCreateForm);

router.post('/novo', ingredientController.create);

module.exports = router;