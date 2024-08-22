const router = require('express').Router();
const  usuarioController = require('../controllers/usuarioController');

router.route('/usuario')
    .post((req, res) => usuarioController.criar_usuario(req, res));

router.route('/login')
    .post((req, res) => usuarioController.loginUsuario(req, res));

module.exports = router