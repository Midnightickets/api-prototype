const router = require('express').Router();

const selectRouter = require('./selectRouter');
const paymentRouter = require('./paymentRouter');
const hostRouter = require('./hostRouter');
const eventoRouter = require('./eventoRouter');
const usuarioRouter = require('./usuarioRouter');
const landingRouter = require('./landingRouter');
const ingressoRouter = require('./ingressoRouter');

router.use('/', ingressoRouter);
router.use('/select', selectRouter);
router.use('/', paymentRouter);
router.use('/', hostRouter);
router.use('/', eventoRouter);
router.use('/', usuarioRouter);
router.use('/landing', landingRouter);

module.exports = router;