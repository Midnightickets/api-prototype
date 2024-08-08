const router = require('express').Router();
const  hostController = require('../controllers/hostController');

router.route('/create_host')
    .post((req, res) => hostController.criar_host(req, res));

router.route('/login_host')
    .post((req, res) => hostController.login_host(req, res));

router.route('/update_moneys')
    .post((req, res) => hostController.update_moneys(req, res));
module.exports = router