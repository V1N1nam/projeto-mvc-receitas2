const authMiddleware = {
    // Verifica se o utilizador está com sessão iniciada
    isAuthenticated: (req, res, next) => {
        if (req.session.userId) {
            return next();
        } else {
            res.redirect('/login');
        }
    },

    // Verifica se o utilizador já está logado (para páginas de login/registo)
    isGuest: (req, res, next) => {
        if (req.session.userId) {
            res.redirect('/dashboard');
        } else {
            return next();
        }
    }
};

module.exports = authMiddleware;