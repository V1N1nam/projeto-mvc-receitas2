const express = require('express');
const path = require('path');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const pantryRoutes = require('./routes/pantryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.set('layout', 'layout'); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'umsegredomuitoforte',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = !!req.session.userId;
    res.locals.userName = req.session.userName || null;
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});


app.get('/', (req, res) => {
    res.render('pagina_inicial', { title: 'Página Inicial' });
});

app.get('/sobre', (req, res) => {
    res.render('sobre', { title: 'Sobre Nós' });
});

app.get('/contato', (req, res) => {
    res.render('contato', { title: 'Fale Conosco' });
});

app.get('/trabalhe', (req, res) => {
    res.render('trabalhe', { title: 'Trabalhe Conosco' });
});

app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        req.flash('error', 'Por favor, faça login para aceder ao painel.');
        return res.redirect('/login');
    }
    res.render('dashboard', { title: 'Meu Painel' });
});

app.use('/', authRoutes);
app.use('/receitas', recipeRoutes);
app.use('/ingredientes', ingredientRoutes);
app.use('/estoque', pantryRoutes);

app.listen(PORT, () => {
    console.log(`Servidor a rodar em http://localhost:${PORT}`);
});