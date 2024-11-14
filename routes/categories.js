const { Router } = require('express')

const { createCategory, deleteCategory, getCategories, getCategory, updateCategory } =
    require('../controllers/category.controller');
const { verifyToken, validateRequests } = require('../middlewares');
const { theFieldExists } = require('../helpers/database-validators');

const router = Router();

router.get('/', [verifyToken
], getCategories);
router.get('/:id', [
    verifyToken,
    theFieldExists('Category', '_id'),
], getCategory);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;