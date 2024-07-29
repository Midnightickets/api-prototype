const router = require('express').Router();

const selectRouter = require('./selectRouter');
const paymentRouter = require('./paymentRouter');
const hostRouter = require('./hostRouter');
const eventoRouter = require('./eventoRouter');
const usuarioRouter = require('./usuarioRouter');
const landingRouter = require('./landingRouter');

router.use('/select', selectRouter);
router.use('/', paymentRouter);
router.use('/', hostRouter);
router.use('/', eventoRouter);
router.use('/', usuarioRouter);
router.use('/email', landingRouter);

module.exports = router;