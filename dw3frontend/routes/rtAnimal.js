
var express = require('express');
var router = express.Router();

// Listagem de animais
router.get('/', function(req, res) {
    res.render('animal/vwLstAnimal', {
        title: 'Animal',
        showNavbar: true,
        activeMenu: 'animal',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

// Formulário de animais
router.get('/form', function(req, res) {
    res.render('animal/vwFormAnimal', {
        title: 'Formulario de Animal',
        showNavbar: true,
        activeMenu: 'animal',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

module.exports = router;
