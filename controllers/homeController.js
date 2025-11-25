// Controlador para páginas gerais/estáticas e dashboard
const homeController = {
    
    // Página Inicial (Pública)
    index(req, res) {
        res.render('pagina_inicial', { title: 'Página Inicial' });
    },

    // Sobre Nós (Pública)
    about(req, res) {
        res.render('sobre', { title: 'Sobre Nós' });
    },

    // Contato (Pública)
    contact(req, res) {
        res.render('contato', { title: 'Fale Conosco' });
    },

    // Trabalhe Conosco (Pública)
    careers(req, res) {
        res.render('trabalhe', { title: 'Trabalhe Conosco' });
    },

    // Dashboard (Protegida)
    dashboard(req, res) {
        // A verificação de autenticação pode ser feita aqui ou na rota via middleware.
        // Como vamos usar o middleware na rota, aqui só renderizamos.
        res.render('dashboard', { title: 'Meu Painel' });
    }
};

module.exports = homeController;