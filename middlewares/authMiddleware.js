const authMiddleware = {
    isAuthenticated: (req, res, next) => {
        if (req.session.userId) {
            return next();
        } else {
            res.redirect('/login');
        }
    },

    isGuest: (req, res, next) => {
        if (req.session.userId) {
            res.redirect('/dashboard');
        } else {
            return next();
        }
    }
};

module.exports = authMiddleware;