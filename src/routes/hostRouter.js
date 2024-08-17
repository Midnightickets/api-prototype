const router = require('express').Router();
const  hostController = require('../controllers/hostController');

router.route('/create_host')
    .post((req, res) => hostController.criar_host(req, res));

router.route('/login_host')
    .post((req, res) => hostController.login_host(req, res));

router.route('/update_moneys')
    .post((req, res) => hostController.update_moneys(req, res));

router.route('/create_access_person')
    .post((req, res) => hostController.create_access_person(req, res));

router.route('/get_access_people')
    .post((req, res) => hostController.get_access_people(req, res));
    
router.route('/delete_access_person')
    .post((req, res) => hostController.remove_access_person(req, res));
    
module.exports = router