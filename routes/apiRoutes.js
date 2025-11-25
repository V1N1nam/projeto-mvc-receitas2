const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.use((req, res, next) => {
    console.log(`API Request: ${req.method} ${req.originalUrl}`);
    next();
});

router.get('/receitas', apiController.getAllRecipes);
router.get('/receitas/:id', apiController.getRecipeById);
router.post('/receitas', apiController.createRecipe);
router.delete('/receitas/:id', apiController.deleteRecipe);

router.get('/ingredientes', apiController.getAllIngredients);
router.post('/ingredientes', apiController.createIngredient);

router.get('/', (req, res) => {
    res.json({ 
        message: 'Bem-vindo à API do Receitas.io!',
        endpoints: [
            'GET /api/receitas',
            'GET /api/receitas/:id',
            'GET /api/ingredientes'
        ]
    });
});

module.exports = router;