const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

router.get('/', recipeController.listAll);

router.get('/novo', isAuthenticated, recipeController.showCreateForm);
router.post('/novo', isAuthenticated, upload.single('imagem'), recipeController.create);

router.get('/:id/editar', isAuthenticated, recipeController.showEditForm);
router.post('/:id/editar', isAuthenticated, upload.single('imagem'), recipeController.update);

router.get('/remover/:id', isAuthenticated, recipeController.delete);

router.get('/:id/download', recipeController.downloadRecipe);

router.get('/:id', recipeController.getDetails);

module.exports = router;