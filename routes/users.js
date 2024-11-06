const { Router } = require('express')
const { check } = require('express-validator');
const { validateUniqueField } = require('../helpers/database-validators');

const { createUser, deleteUser, getUser, getUsers, updateUser } =
    require('../controllers/user.controller');
const { validateRequests } = require('../middlewares/validate-requests');
const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', [
    check('email', 'The email is not valid').isEmail(),
    check('name', 'The name is required').notEmpty(),
    check('username', 'The name is required').notEmpty(),
    check('email', 'The email is required').notEmpty(),
    check('password', 'minimum length of 6 characters').isLength({ min: 6 }),
    validateUniqueField('User', 'email'),
    validateRequests
], createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;