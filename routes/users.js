const { Router } = require('express')
const { check, query } = require('express-validator');

const { validateUniqueField, theFieldExists } = require('../helpers/database-validators');

const {
    verifyToken,
    hasRole,
    validateRequests } = require('../middlewares');

const { createUser, deleteUser, getUser, getUsers, updateUser } =
    require('../controllers/user.controller');


const router = Router();

router.get('/', [
    query('limit', 'The limit must be a positive integer').optional().isNumeric().isInt(),
    query('page', 'The page must be a positive integer').optional().isNumeric().isInt(),
    validateRequests
], getUsers);

router.get('/:id', getUser);

router.post('/', [
    check('role', 'The role is invalid').optional().isIn(['admin', 'user', 'guest']),
    check('email', 'The email is not valid').isEmail(),
    check('name', 'The name is required').notEmpty(),
    check('username', 'The name is required').notEmpty(),
    check('email', 'The email is required').notEmpty(),
    check('password', 'minimum length of 6 characters').isLength({ min: 6 }),
    check('email').custom(validateUniqueField('User', 'email')),
    check('username').custom(validateUniqueField('User', 'username')),
    validateRequests
], createUser);

router.put('/:id', [
    verifyToken,
    hasRole('admin'),
    check('id', 'Is not a valid mongo id').isMongoId(),
    check('id').custom(theFieldExists('User', '_id')),
    check('username').custom(validateUniqueField('User', 'username')),
    check('email').custom(validateUniqueField('User', 'email')),
    validateRequests
], updateUser);

router.delete('/:id', [
    verifyToken,
    hasRole('admin'),
    check('id', 'Is not a valid mongo id').isMongoId(),
    check('id').custom(theFieldExists('User', '_id')),
    validateRequests
], deleteUser);

module.exports = router;