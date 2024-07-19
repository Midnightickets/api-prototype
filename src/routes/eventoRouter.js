const router = require('express').Router();
const eventoController = require('../controllers/EventoController');

router.route('/create_evento')
    .post((req, res) => eventoController.criar_evento(req, res));

module.exports = router