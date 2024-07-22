const router = require('express').Router();
const  usuarioController = require('../controllers/usuarioController');

router.route('/create_usuario')
    .post((req, res) => usuarioController.criar_usuario(req, res));

module.exports = router