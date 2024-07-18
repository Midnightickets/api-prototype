const router = require('express').Router();

const paymentRouter = require('./paymentRouter');

router.use('/', paymentRouter);

module.exports = router;