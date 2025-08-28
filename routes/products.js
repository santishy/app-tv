const { Router } = require('express');

const { check } = require('express-validator');
const { productExists, theFieldExists } = require('../helpers');
const { validateFiles } = require('../middlewares/validate-files');
const { validateRequests, verifyToken, hasRole } = require('../middlewares');
const { handleFilters } = require('../middlewares/jsonApi/handle-filters');
const Product = require('../models/Product');

const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} = require('../controllers/product.controller');

const productImagesRouter = require('./product-images');
const { validateDimensionsImage } = require('../middlewares/validate-image-dimensions');

const router = Router();

router.use('/:id', productImagesRouter);

router.get(
  '/',
  [
    // verifyToken,
    handleFilters(
      ['title', 'description', 'model', 'month', 'category', 'search'],
      Product.customFilters,
    ),
    validateRequests,
  ],
  getProducts,
);
router.get(
  '/:id',
  [
    verifyToken,
    check('id', 'It is not a mongo id').isMongoId(),
    check('id').custom(theFieldExists('Product', '_id')),
    validateRequests,
  ],
  getProduct,
);
router.post(
  '/',
  [
    verifyToken,
    check('title').notEmpty().withMessage('El campo título es requerido.'),
    check('model').notEmpty().withMessage('El campo modelo es requerido.'),
    check('title').custom(productExists).withMessage('El producto ya existe en la base de datos.'),
    validateFiles(['jpg', 'png', 'jpeg', 'git', 'webp'], 'images'),
    validateDimensionsImage('images', { width: 720, height: 360 }),
    check('description').notEmpty().withMessage('El campo descripción es requerido.'),
    check('category').isMongoId().withMessage('El id categoría no es un ID valido.'),
    check('category')
      .custom(theFieldExists('Category', '_id'))
      .withMessage('El campo categoría no existe en la base de datos.'),
    check('images.*.url').optional().isURL().withMessage('El campo URL debe ser de tipo URL'),
    check('price')
      .notEmpty()
      .withMessage('El campo precio es requerido.')
      .isNumeric()
      .withMessage('El campo precio debe ser númerico.'),
    validateRequests,
  ],
  createProduct,
);
router.patch(
  '/:id',
  [
    verifyToken,
    check('id', 'It is not a mongo id').isMongoId(),
    check('id').custom(theFieldExists('Product', '_id')),
    check('title')
      .notEmpty()
      .withMessage('El campo título es requerido.')
      .custom(productExists)
      .withMessage('Este producto ya existe en la base de datos '),
    check('model').notEmpty().withMessage('El campo modelo es requerido.'),
    check('category')
      .notEmpty()
      .withMessage('El campo categoría es requerido.')
      .isMongoId()
      .withMessage('El campo catogoría no es valido.'),
    check('category')
      .custom(theFieldExists('Category', '_id'))
      .withMessage('El campo categoría no existe en la base de datos.'),
    validateFiles(['jpg', 'png', 'jpeg', 'git', 'webp'], 'images'),
    validateDimensionsImage('images', { width: 720, height: 360 }),
    // <check("images")
    //   .custom(validateDimensionsImage(1980, 1080))
    //   .withMessage("La imagen debe tener mínimo de: 1980x1080")
    //   .optional(),>
    // check("images")
    //   .optional()
    //   .custom(validateFiles(["jpg", "png", "jpeg", "git"], "images"))
    //   .withMessage(
    //     "La imagen no tiene la extensión correcta: jpg, png, jpeg, git"
    //   ),
    // check("images.*.url")
    //   .optional()
    //   .isURL()
    //   .withMessage("El campo URL debe ser de tipo URL"),
    check('price')
      .notEmpty()
      .withMessage('El campo precio es requerido.')
      .isNumeric()
      .withMessage('El campo precio debe ser númerico'),
    validateRequests,
  ],
  updateProduct,
);

router.delete(
  '/:id',
  [
    verifyToken,
    hasRole('admin'),
    check('id', 'It is not a mongo id').isMongoId(),
    check('id').custom(theFieldExists('Product', '_id')),
    validateRequests,
  ],
  deleteProduct,
);

module.exports = router;
