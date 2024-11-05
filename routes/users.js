const { Router } = require('express')

const { createUser, deleteUser, getUser, getUsers, updateUser } = 
    require('../controllers/user.controller');
const { check } = require('express-validator');

const router = Router();

router.get('/',getUsers);
router.get('/:id',getUser);
router.post('/',[check('email','The email is not valid').isEmail()],createUser);
router.patch('/:id',updateUser);
router.delete('/:id',deleteUser);

module.exports = router;