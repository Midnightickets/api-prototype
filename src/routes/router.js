const router = require('express').Router();

const paymentRouter = require('./paymentRouter');
const hostRouter = require('./hostRouter');
const eventoRouter = require('./eventoRouter');

router.use('/', paymentRouter);
router.use('/', hostRouter);
router.use('/', eventoRouter);

module.exports = router;