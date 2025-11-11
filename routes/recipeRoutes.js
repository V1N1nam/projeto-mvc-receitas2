const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const multer = require('multer');

// Configuração do Multer para upload de imagens (Requisito do Projeto)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Pasta onde as imagens serão guardadas
    },
    filename: (req, file, cb) => {
        // Cria um nome de ficheiro único para evitar sobreposição
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Rota pública - Lista todas as receitas (ex: /receitas)
router.get('/', recipeController.listAll);

// --- Rotas Protegidas (e Específicas) PRIMEIRO ---

// Mostra o formulário para criar uma nova receita (ex: /receitas/novo)
// CORREÇÃO: Esta rota foi movida para ANTES de '/:id'
router.get('/novo', isAuthenticated, recipeController.showCreateForm);

// Processa a criação da nova receita, com upload de imagem
router.post('/novo', isAuthenticated, upload.single('imagem'), recipeController.create);

// --- Rotas Públicas (e Genéricas) DEPOIS ---

// Rota pública - Vê detalhes de uma receita (ex: /receitas/1)
// Esta rota tem de ser uma das últimas, pois "apanha" tudo.
router.get('/:id', recipeController.getDetails);


// (Rotas de update e delete ficariam aqui)

module.exports = router;