const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest, isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/cadastro', isGuest, authController.showRegisterPage);

router.post('/cadastro', isGuest, authController.registerUser);

router.get('/login', isGuest, authController.showLoginPage);


router.post('/login', isGuest, authController.loginUser);

router.get('/logout', isAuthenticated, authController.logoutUser);

module.exports = router;

