const homeController = {
    
    index(req, res) {
        res.render('pagina_inicial', { title: 'Página Inicial' });
    },

    about(req, res) {
        res.render('sobre', { title: 'Sobre Nós' });
    },

    contact(req, res) {
        res.render('contato', { title: 'Fale Conosco' });
    },

    careers(req, res) {
        res.render('trabalhe', { title: 'Trabalhe Conosco' });
    },

    dashboard(req, res) {
        res.render('dashboard', { title: 'Meu Painel' });
    }
};

module.exports = homeController;