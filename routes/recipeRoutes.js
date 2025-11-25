const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const multer = require('multer');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Rota pública: Listar receitas
router.get('/', recipeController.listAll);

// --- Rotas Protegidas ---

// 1. Criar Nova Receita
router.get('/novo', isAuthenticated, recipeController.showCreateForm);
router.post('/novo', isAuthenticated, upload.single('imagem'), recipeController.create);

// 2. Editar Receita
router.get('/:id/editar', isAuthenticated, recipeController.showEditForm);
router.post('/:id/editar', isAuthenticated, upload.single('imagem'), recipeController.update);

// 3. Remover Receita (NOVA ROTA ADICIONADA)
router.get('/remover/:id', isAuthenticated, recipeController.delete);

// --- Rotas Dinâmicas ---

// Detalhes da receita (sempre por último para não conflitar)
router.get('/:id', recipeController.getDetails);

module.exports = router;