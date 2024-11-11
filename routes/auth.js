const { Router } = require('express')
const { check } = require('express-validator');

const login = require('../controllers/auth/login.controller');

const { validateRequests } = require('../middlewares/validate-requests');
const { theFieldExists } = require('../helpers/database-validators');
const router = Router();

router.post('/login', [
    check('username', 'The name is required').notEmpty(),
    check('username').custom(theFieldExists('User', 'username')),
    check('password', 'The password is required').notEmpty(),
    validateRequests
], login);



module.exports = router;