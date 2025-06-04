const { Router } = require("express");
const { check, query } = require("express-validator");

const {
  validateUniqueField,
  theFieldExists,
} = require("../helpers/database-validators");

const { verifyToken, hasRole, validateRequests } = require("../middlewares");

const {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} = require("../controllers/user.controller");

const router = Router();

router.get(
  "/",
  [
    query("limit", "The limit must be a positive integer")
      .optional()
      .isNumeric()
      .withMessage("El campo limit debé ser numerico")
      .isInt()
      .withMessage("El campo limit debe ser un entero"),
    query("page", "The page must be a positive integer")
      .optional()
      .isNumeric()
      .withMessage("El campo page debe ser númerico.")
      .isInt()
      .withMessage("El campo page debe ser un entero"),
    validateRequests,
  ],
  getUsers
);

router.get(
  "/:id",
  [
    verifyToken,
    hasRole("admin"),
    check("id", "Is not a valid mongo id").isMongoId(),
    check("id").custom(theFieldExists("User", "_id")),
    validateRequests,
  ],
  getUser
);

router.post(
  "/",
  [
    check("role", "The role is invalid")
      .optional()
      .isIn(["admin", "user", "guest"]),
    check("email").isEmail().withMessage("El campo correo no es valido."),
    check("name").notEmpty().withMessage("El campo nombre es requerido."),
    check("username").notEmpty().withMessage("El campo usuario es requerido."),
    check("email").notEmpty().withMessage("El campo correo es requerido."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("El password debe tener al menos 6 caracteres."),
    check("email")
      .custom(validateUniqueField("User", "email"))
      .withMessage("El correo ya existe en la base de datos."),
    check("username")
      .custom(validateUniqueField("User", "username"))
      .withMessage("El nombre de usuario ya existe en la base de datos."),
    validateRequests,
  ],
  createUser
);

router.put(
  "/:id",
  [
    verifyToken,
    hasRole("admin"),
    check("id").isMongoId().withMessage("El id no es un Identificador valido"),
    check("id")
      .custom(theFieldExists("User", "_id"))
      .withMessage("El campo id no existe en la base de datos.")
      .withMessage("El id no existe en la base de datos"),
    check("name").notEmpty().withMessage("El campo nombre es requerido."),
    check("username")
      .custom(validateUniqueField("User", "username"))
      .withMessage("El campo nombre de usuario debe ser unico")
      .notEmpty()
      .withMessage("El campo nombre de usuario es requerido."),
    check("email")
      .custom(validateUniqueField("User", "email"))
      .withMessage("El campo correo ya existe en la base de datos ")
      .isEmail()
      .withMessage("El campo correo no es valido.")
      .notEmpty()
      .withMessage("El campo correo es requerido."),
    check("password")
      .optional({ checkFalsy: true }) //ignora los valores falsy : undefined , "", null
      .isLength({ min: 6 })
      .withMessage("El password debe tener al menos 6 caracteres."),
    validateRequests,
  ],
  updateUser
);

router.delete(
  "/:id",
  [
    verifyToken,
    hasRole("admin"),
    check("id", "Is not a valid mongo id").isMongoId(),
    check("id").custom(theFieldExists("User", "_id")),
    validateRequests,
  ],
  deleteUser
);

module.exports = router;
