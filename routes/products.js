const { Router } = require('express')

const { createProduct, deleteProduct, getProduct, getProducts, updateProduct } =
    require('../controllers/product.controller');
const { check } = require('express-validator');
const { productExists, theFieldExists } = require('../helpers/database-validators');
const { validateRequests, verifyToken } = require('../middlewares');

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/',
    [
        verifyToken,
        check('title', 'The title field is required').notEmpty(),
        check('model', 'The model field is required').notEmpty(),
        check('title').custom(productExists),
        check('description', 'The description field is required').notEmpty(),
        check('categoryId', 'It is not a mongo id').isMongoId(),
        check('categoryId').custom(theFieldExists('Category', '_id')),
        check('images.*.url', 'The URL field must be of type URL').optional().isURL(),
        check('price')
            .notEmpty()
            .withMessage('The price field is required')
            .isNumeric()
            .withMessage('The price must be a number'),
        validateRequests
    ]
    , createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;