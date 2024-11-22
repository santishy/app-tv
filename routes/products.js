const { Router } = require('express')

const { createProduct, deleteProduct, getProduct, getProducts, updateProduct } =
    require('../controllers/product.controller');
const { check } = require('express-validator');
const { productExists, theFieldExists } = require('../helpers/database-validators');
const { validateRequests, verifyToken, hasRole } = require('../middlewares');

const router = Router();

router.get('/', getProducts);
router.get('/:id',
    [
        verifyToken,
        check('id', 'It is not a mongo id').isMongoId(),
        check('id').custom(theFieldExists('Product', '_id')),
        validateRequests
    ],
    getProduct);
router.post('/',
    [
        verifyToken,
        check('title', 'The title field is required').notEmpty(),
        check('model', 'The model field is required').notEmpty(),
        check('title').custom(productExists),
        check('description', 'The description field is required').notEmpty(),
        check('category', 'It is not a mongo id').isMongoId(),
        check('category').custom(theFieldExists('Category', '_id')),
        check('images.*.url', 'The URL field must be of type URL').optional().isURL(),
        check('price')
            .notEmpty()
            .withMessage('The price field is required')
            .isNumeric()
            .withMessage('The price must be a number'),
        validateRequests
    ]
    , createProduct);
router.patch('/:id', [
    verifyToken,
    check('id', 'It is not a mongo id').isMongoId(),
    check('id').custom(theFieldExists('Product', '_id')),

    check('title').custom(productExists),
    check('category', 'It is not a mongo id').optional().isMongoId(),
    check('category').optional().custom(theFieldExists('Category', '_id')),
    check('images.*.url', 'The URL field must be of type URL').optional().isURL(),
    check('price')
        .optional()
        .isNumeric()
        .withMessage('The price must be a number'),
    validateRequests
], updateProduct);

router.delete('/:id', [
    verifyToken,
    hasRole('admin'),
    check('id', 'It is not a mongo id').isMongoId(),
    check('id').custom(theFieldExists('Product', '_id')),
    validateRequests
], deleteProduct);

module.exports = router;