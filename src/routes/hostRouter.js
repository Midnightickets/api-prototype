const router = require('express').Router();
const  hostController = require('../controllers/hostController');

router.route('/create_host')
    .post((req, res) => hostController.createHost(req, res));

module.exports = router