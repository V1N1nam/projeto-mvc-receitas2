// Este middleware verifica se o utilizador está autenticado
const authMiddleware = {
    
    // Verifica se o utilizador está com sessão iniciada
    isAuthenticated: (req, res, next) => {
        // 'req.session.userId' é criado pelo authController durante o login
        if (req.session.userId) {
            // Se o utilizador existe na sessão, continua para a rota
            return next();
        } else {
            // Se não existe, redireciona para a página de login
            res.redirect('/login');
        }
    },

    // (Opcional) Verifica se o utilizador já está logado e não deve ver o login/registo
    isGuest: (req, res, next) => {
        if (req.session.userId) {
            res.redirect('/dashboard'); // Redireciona para a área interna
        } else {
            return next();
        }
    }
};

// Exportamos o objeto para que as rotas o possam usar
module.exports = authMiddleware;

