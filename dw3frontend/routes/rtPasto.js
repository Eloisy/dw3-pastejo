var express = require('express');
var router = express.Router();

// Listagem de pastos
router.get('/', function(req, res) {
    res.render('pasto/vwLstPasto', {
        title: 'Pastos',
        showNavbar: true,
        activeMenu: 'pasto',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

// Formulário de pastos
router.get('/form', function(req, res) {
    res.render('pasto/vwFormPasto', {
        title: 'Formulario de Pasto',
        showNavbar: true,
        activeMenu: 'pasto',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

module.exports = router;