const router = require('express').Router();

const paymentRouter = require('./paymentRouter');
const hostRouter = require('./hostRouter');
const eventoRouter = require('./eventoRouter');
const usuarioRouter = require('./usuarioRouter');

router.use('/', paymentRouter);
router.use('/', hostRouter);
router.use('/', eventoRouter);
router.use('/', usuarioRouter);

module.exports = router;