const { Router } = require("express");
const { search } = require("../controllers/search/search.controller");
const { verifyToken, validateRequests } = require("../middlewares");
const { check } = require("express-validator");
const { route } = require("./products");

const router = Router();

router.get(
  "/:model/:term",
  [
    verifyToken,
    check("model")
      .isLength({ min: 2 })
      .withMessage("The model must have at least two characters"),
    check("term")
      .isLength({ min: 2 })
      .withMessage("The term must have at least two characters"),
    validateRequests,
  ],
  search
);

module.exports = router;
