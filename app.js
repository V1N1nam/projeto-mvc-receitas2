const express = require('express');
const path = require('path');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors'); 

// Importação das Rotas
const homeRoutes = require('./routes/homeRoutes');       // <--- Verifica se este arquivo existe!
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const pantryRoutes = require('./routes/pantryRoutes');
const apiRoutes = require('./routes/apiRoutes');         // <--- Verifica se este arquivo existe!

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações
app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo',
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

// Uso das Rotas
app.use('/api', apiRoutes);
app.use('/receitas', recipeRoutes);
app.use('/ingredientes', ingredientRoutes);
app.use('/estoque', pantryRoutes);
app.use('/', authRoutes);
app.use('/', homeRoutes); // Rotas gerais ficam por último

app.listen(PORT, () => {
    console.log(`Servidor a rodar em http://localhost:${PORT}`);
});