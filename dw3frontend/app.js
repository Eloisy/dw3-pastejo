
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var nunjucks = require('nunjucks');

var indexRouter = require('./routes/rtIndex');
var loginRouter = require('./routes/rtLogin');
var homeRouter = require('./routes/rtHome');
var alocadoRouter = require('./routes/rtAlocado');
var animalRouter = require('./routes/rtAnimal');
var pastoRouter = require('./routes/rtPasto');
var piqueteRouter = require('./routes/rtPiquete');

require('dotenv').config({
    path: path.join(__dirname, 'dw3frontend.env'),
    quiet: true
});

var app = express();

var viewsPath = path.join(__dirname, 'views');
var appsPath = path.join(__dirname, 'apps');

const port = process.env.PORT || 40100;

// Configuração do Nunjucks
app.set('views', [viewsPath, appsPath]);
app.set('view engine', 'njk');

nunjucks.configure([viewsPath, appsPath], {
    autoescape: true,
    express: app,
    noCache: app.get('env') === 'development'
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/apps', express.static(appsPath));

// Rotas
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);
app.use('/alocado', alocadoRouter);
app.use('/animal', animalRouter);
app.use('/pasto', pastoRouter);
app.use('/piquete', piqueteRouter);

// Página não encontrada
app.use(function(req, res, next) {
    next(createError(404));
});

// Tratamento de erros
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);

    res.send(
        '<h1>Erro ' + (err.status || 500) + '</h1>' +
        '<p>' + err.message + '</p>'
    );
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`App listening at port ${port}`);
});
