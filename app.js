// 1. IMPORTAÇÕES ESSENCIAIS
const express = require('express');
const path = require('path');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const expressLayouts = require('express-ejs-layouts');

// 2. INICIALIZAÇÃO DO APP
const app = express();
const PORT = process.env.PORT || 3000;

// 3. CONFIGURAÇÕES (MIDDLEWARES)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuramos o EJS e o sistema de Layouts
app.use(expressLayouts); // <-- MOVIDO PARA CIMA
app.set('layout', 'layout'); // Define 'layout.ejs' como o arquivo de layout padrão
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// 4. ROTAS (AGORA DEPOIS DA CONFIGURAÇÃO DO LAYOUT)
app.get('/', (req, res) => {
    res.render('home', { title: 'Página Inicial' });
});

app.use('/', authRoutes);

// 5. INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor a rodar em http://localhost:${PORT}`);
});

