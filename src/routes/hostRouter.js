const router = require('express').Router();
const  hostController = require('../controllers/hostController');

router.route('/create_host')
    .post((req, res) => hostController.criar_host(req, res));

router.route('/login_host')
    .post((req, res) => hostController.login_host(req, res));
    
module.exports = router