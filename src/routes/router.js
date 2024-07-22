const router = require('express').Router();

const paymentRouter = require('./paymentRouter');
const hostRouter = require('./hostRouter');
const eventoRouter = require('./eventoRouter');
const usuarioRouter = require('./usuarioRouter');
const pacoteRouter = require('./pacoteRouter');

router.use('/', paymentRouter);
router.use('/', hostRouter);
router.use('/', eventoRouter);
router.use('/', usuarioRouter);
router.use('/', pacoteRouter);

module.exports = router;