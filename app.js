// 1. IMPORTAÇÕES ESSENCIAIS
const express = require('express');
const path = require('path');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash'); // <-- ADICIONADO: Para mensagens flash

// 2. IMPORTAÇÃO DE TODAS AS ROTAS
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const pantryRoutes = require('./routes/pantryRoutes');

// 3. INICIALIZAÇÃO DO APP
const app = express();
const PORT = process.env.PORT || 3000;

// 4. CONFIGURAÇÕES (MIDDLEWARES)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do EJS e Layouts
app.use(expressLayouts);
app.set('layout', 'layout'); // Assume que 'views/layout.ejs' é o seu layout
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CONFIGURAÇÃO DA SESSÃO
app.use(session({
    secret: process.env.SESSION_SECRET || 'umsegredomuitoforte',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// CONFIGURAÇÃO DO FLASH (DEVE VIR DEPOIS DA SESSÃO)
app.use(flash());

// Middleware para expor dados da sessão e MENSAGENS FLASH para as Views (EJS)
app.use((req, res, next) => {
    res.locals.isAuthenticated = !!req.session.userId;
    res.locals.userName = req.session.userName || null;
    
    // Novas variáveis locais para as mensagens flash
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    
    next();
});

// 5. ROTAS
// Rota principal (página inicial)
app.get('/', (req, res) => {
    // Corrigido da nossa conversa anterior: renderiza a página de conteúdo
    res.render('pagina_inicial', { title: 'Página Inicial' });
});

// Rota do "Dashboard" (página interna principal após o login)
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        // Agora podemos usar flash para explicar por que foram redirecionados
        req.flash('error', 'Por favor, faça login para aceder ao painel.');
        return res.redirect('/login');
    }
    res.render('dashboard', { title: 'Meu Painel' });
});

// Usando os arquivos de rotas com prefixos
app.use('/', authRoutes);
app.use('/receitas', recipeRoutes);
app.use('/ingredientes', ingredientRoutes);
app.use('/estoque', pantryRoutes);

// 6. INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor a rodar em http://localhost:${PORT}`);
});