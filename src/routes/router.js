const router = require('express').Router();

const paymentRouter = require('./paymentRouter');
const hostRouter = require('./hostRouter');

router.use('/', paymentRouter);
router.use('/', hostRouter);

module.exports = router;