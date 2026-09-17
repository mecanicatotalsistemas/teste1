require('dotenv').config();  // Carrega as variáveis de ambiente do .env

const express = require('express');
const { PORT } = require('./config.js');
const app = express();
app.use('/api', (req, res, next) => { res.set('Access-Control-Allow-Origin', '*'); next(); });
// Middleware para verificar o token de acesso
const checkAccessToken = (req, res, next) => {
    const token = req.query.token;  // Token enviado como parâmetro na URL

    if (token && token === process.env.ACCESS_TOKEN) {
        return next();  // Se o token for válido, segue para o próximo middleware ou rota
    } else {
        return res.redirect('/error.html');  // Redireciona para uma página de erro ou login
    }
};

// Middleware para servir a página index.html apenas se o token for válido
app.use('/index.html', checkAccessToken, express.static('wwwroot/index.html'));

// Serve outros arquivos estáticos
app.use(express.static('wwwroot'));

// Rota de erro ou login
app.get('/error.html', (req, res) => {
    res.send('<h1>Acesso negado. Você precisa de um token válido para acessar esta página.</h1>');
});

// Mantém as rotas originais
app.use(require('./routes/auth.js'));
app.use(require('./routes/models.js'));

// Inicia o servidor
app.listen(PORT, function () {
    console.log(`Server listening on port ${PORT}...`);
});
