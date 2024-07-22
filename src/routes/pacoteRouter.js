const router = require('express').Router();
const  pacoteController = require('../controllers/pacoteController');

router.route('/create_pacote')
    .get((req, res) => pacoteController.get_pacotes(req, res))
    .post((req, res) => pacoteController.create_pacote(req, res))

module.exports = router