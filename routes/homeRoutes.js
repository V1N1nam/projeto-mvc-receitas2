const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Rotas Públicas
router.get('/', homeController.index);
router.get('/sobre', homeController.about);
router.get('/contato', homeController.contact);
router.get('/trabalhe', homeController.careers);

// Rotas Protegidas
// Usamos o middleware 'isAuthenticated' para proteger o dashboard
router.get('/dashboard', isAuthenticated, homeController.dashboard);

module.exports = router;