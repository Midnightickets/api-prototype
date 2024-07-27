const router = require('express').Router();
const  selectOptionsController = require('../controllers/selectOptionsController');

router.route('/evento_pacotes')
    .get((req, res) => selectOptionsController.get_evento_pacotes(req, res));

router.route('/coins')
    .get((req, res) => selectOptionsController.get_coins(req, res));

    module.exports = router