var express = require('express');
var router = express.Router();

// Listagem de piquetes
router.get('/', function(req, res) {
    res.render('piquete/vwLstPiquete', {
        title: 'Piquetes',
        showNavbar: true,
        activeMenu: 'piquete',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

// Formulário de piquetes
router.get('/form', function(req, res) {
    res.render('piquete/vwFormPiquete', {
        title: 'Formulario de Piquete',
        showNavbar: true,
        activeMenu: 'piquete',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

module.exports = router;