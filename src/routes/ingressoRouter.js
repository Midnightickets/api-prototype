
const router = require('express').Router();
const  ingressoController = require('../controllers/ingressoController');

router.route('/preference_ingresso')
    .post((req, res) => ingressoController.create_preference_ingresso(req, res))

module.exports = router