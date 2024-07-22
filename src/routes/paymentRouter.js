const router = require('express').Router();
const paymentController = require('../controllers/paymentController');

router.route('/process_payment')
    .post((req, res) => paymentController.brick_payment(req, res));

router.route('/create_preference')
    .post((req, res) => paymentController.criar_preference(req, res));

router.route('/get_pagamento')
    .get((req, res) => paymentController.buscar_pagamento(req, res));


module.exports = router