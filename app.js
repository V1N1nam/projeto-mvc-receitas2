// 1. IMPORTAÇÕES ESSENCIAIS
const express = require('express');
const path = require('path');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session'); // <-- ADICIONADO: Essencial para o login

// 2. IMPORTAÇÃO DE TODAS AS ROTAS
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const pantryRoutes = require('./routes/pantryRoutes');

// 3. INICIALIZAÇÃO DO APP
const app = express();
const PORT = process.env.PORT || 3000;

// 4. CONFIGURAÇÕES (MIDDLEWARES)
// Middlewares para ler dados de formulário e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos (CSS, JS, Imagens) da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do EJS e Layouts
app.use(expressLayouts);
app.set('layout', 'layout'); // Define 'layout.ejs' como o arquivo de layout padrão
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CONFIGURAÇÃO DA SESSÃO (OBRIGATÓRIO para o Login)
app.use(session({
    secret: process.env.SESSION_SECRET || 'umsegredomuitoforte', // Mude isso no seu .env!
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Para desenvolvimento. Mude para 'true' se usar HTTPS
}));

// Middleware para expor dados da sessão para as Views (EJS)
// Isso permite que o layout.ejs saiba se o usuário está logado
app.use((req, res, next) => {
    res.locals.isAuthenticated = !!req.session.userId;
    res.locals.userName = req.session.userName || null;
    next();
});

// 5. ROTAS
// Rota principal (página inicial)
app.get('/', (req, res) => {
    res.render('home', { title: 'Página Inicial' });
});

// Rota do "Dashboard" (página interna principal após o login)
app.get('/dashboard', (req, res) => {
    // Um exemplo de como proteger uma rota
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('dashboard', { title: 'Meu Painel' });
});

// Usando os arquivos de rotas com prefixos
app.use('/', authRoutes); // Rotas: /login, /cadastro, /logout
app.use('/receitas', recipeRoutes); // Rotas: /receitas, /receitas/novo, /receitas/1
app.use('/ingredientes', ingredientRoutes); // Rotas: /ingredientes, /ingredientes/novo
app.use('/estoque', pantryRoutes); // Rotas: /estoque, /estoque/adicionar

// 6. INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor a rodar em http://localhost:${PORT}`);
});
