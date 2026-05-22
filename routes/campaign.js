const { Router } = require('express');
const { check } = require('express-validator');

const {
  createCampaign,
  deleteCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
} = require('../controllers/campaign.controller');
const { verifyToken, validateRequests } = require('../middlewares');
const { endDateAfterStartDate, theFieldExists } = require('../helpers/database-validators');

const router = Router();

const saveCampaignValidations = [
  check('name')
    .notEmpty()
    .withMessage('The name is required')
    .bail()
    .isLength({ min: 2, max: 100 })
    .trim()
    .escape()
    .withMessage('The name must be between 2 and 100 characters'),
  check('startDate')
    .notEmpty()
    .withMessage('The start date is required')
    .bail()
    .isISO8601()
    .withMessage('Invalid start date'),
  check('endDate')
    .notEmpty()
    .withMessage('The end date is required')
    .bail()
    .isISO8601()
    .withMessage('Invalid end date')
    .bail()
    .custom(endDateAfterStartDate('startDate'))
    .withMessage('The end date must be after the start date'),
  validateRequests,
];

const getCampaignValidations = [
  verifyToken,
  check('id', 'It is not a mongo id').isMongoId().withMessage('Invalid campaign ID'),
  check('id').custom(theFieldExists('Campaign', '_id')),
  validateRequests,
];

router.get('/', [verifyToken, validateRequests], getCampaigns);

router.get('/:id', getCampaignValidations, getCampaign);

router.post('/', [verifyToken, ...saveCampaignValidations], createCampaign);

router.put(
  '/:id',
  [
    verifyToken,
    check('id').isMongoId().withMessage('Invalid campaign ID'),
    check('id').custom(theFieldExists('Campaign', '_id')),
    ...saveCampaignValidations,
  ],
  updateCampaign,
);

router.delete('/:id', getCampaignValidations, deleteCampaign);

module.exports = router;
