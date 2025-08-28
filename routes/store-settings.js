const { Router } = require('express');
const { check } = require('express-validator');
const { verifyToken, validateRequests } = require('../middlewares');

const { getStoreSettings, upsertStoreSetting } = require('../controllers/store-setting.controller');

const router = Router();

router.get(
  '/:id',
  [check('id').equals('singleton').withMessage('Invalid store settings ID'), validateRequests],
  getStoreSettings,
);

router.patch(
  '/:id',
  [
    verifyToken,
    check('id').equals('singleton').withMessage('Invalid store settings ID'),
    check('openingHours')
      .notEmpty()
      .withMessage('El campo horario de apertura es requerido.')
      .isString()
      .withMessage('El campo horario de apertura debe ser una cadena de texto.'),
    check('notice')
      .notEmpty()
      .withMessage('El campo aviso es requerido.')
      .isString()
      .withMessage('El campo aviso debe ser una cadena de texto.'),
    check('phoneNumber')
      .notEmpty()
      .withMessage('El campo teléfono es requerido.')
      .isString()
      .withMessage('El campo teléfono es requerido.'),
    check('slideDelaySec')
      .notEmpty()
      .withMessage('El campo de tiempo de transición es requerido.')
      .isInt({ min: 1, max: 60 })
      .withMessage('El campo de tiempo de transición debe ser un número entre 1 y 60.')
      .toInt(),
    validateRequests,
  ],
  upsertStoreSetting,
);

module.exports = router;
