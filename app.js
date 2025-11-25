require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

require('./config/server_config')(app);

app.use('/api', require('./routes/apiRoutes'));
app.use('/receitas', require('./routes/recipeRoutes'));
app.use('/ingredientes', require('./routes/ingredientRoutes'));
app.use('/estoque', require('./routes/pantryRoutes'));
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/homeRoutes'));

app.listen(PORT, () => {
    console.log(`Servidor a rodar em: http://localhost:${PORT}`);
    console.log(`API disponível em: http://localhost:${PORT}/api`);
});