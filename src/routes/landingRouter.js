const router = require('express').Router();
const  landingController = require('../controllers/landingController');

router.route('/email')
    .post((req, res) => landingController.saveLandingInfo(req, res))

module.exports = router