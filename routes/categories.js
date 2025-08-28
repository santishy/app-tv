const { Router } = require('express');
const { check, query } = require('express-validator');

const {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} = require('../controllers/category.controller');
const { verifyToken, validateRequests, hasRole } = require('../middlewares');
const { theFieldExists, validateUniqueField } = require('../helpers/database-validators');
const { handleFilters } = require('../middlewares/jsonApi/handle-filters');

const router = Router();

router.get(
  '/',
  [
    verifyToken,
    handleFilters(['name'], {}),
    query('limit', 'The limit must be a positive integer').optional().isNumeric().isInt(),
    query('page', 'The page must be a positive integer').optional().isNumeric().isInt(),
    validateRequests,
  ],
  getCategories,
);

router.get(
  '/:id',
  [
    verifyToken,
    check('id', 'It is not a mongo id').isMongoId(),
    check('id').custom(theFieldExists('Category', '_id')),
    validateRequests,
  ],
  getCategory,
);

router.post(
  '/',
  [
    verifyToken,
    check('name', 'The name field is required').notEmpty(),
    check('name').custom(validateUniqueField('Category', 'name')),
    validateRequests,
  ],
  createCategory,
);

router.patch(
  '/:id',
  [
    verifyToken,
    check('id', 'It is not a mongo id').isMongoId(),
    check('name', 'The name field is required').notEmpty(),
    check('name').custom(validateUniqueField('Category', 'name')),
    validateRequests,
  ],
  updateCategory,
);

router.delete(
  '/:id',
  [
    verifyToken,
    hasRole('admin'),
    check('id', 'It is not a mongo id').isMongoId(),
    check('id').custom(theFieldExists('Category', '_id')),
    validateRequests,
  ],
  deleteCategory,
);

module.exports = router;
