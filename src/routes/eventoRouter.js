const router = require('express').Router();
const eventoController = require('../controllers/eventoController');

router.route('/create_evento')
    .post((req, res) => eventoController.criar_evento(req, res));
router.route('/get_eventos')
    .post((req, res) => eventoController.buscar_eventos(req, res));
router.route('/get_evento_host')
    .post((req, res) => eventoController.buscar_evento_host(req, res));
module.exports = router