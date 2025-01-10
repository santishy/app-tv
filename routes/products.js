const { Router } = require("express");

const { check } = require("express-validator");
const { productExists, theFieldExists, validateFiles } = require("../helpers");

const { validateRequests, verifyToken, hasRole } = require("../middlewares");
const { handleFilters } = require("../middlewares/jsonApi/handle-filters");
const Product = require("../models/Product");

const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} = require("../controllers/product.controller");

const productImagesRouter = require("./product-images");

const router = Router();

router.use("/:id", productImagesRouter);

router.get(
  "/",
  [
    verifyToken,
    handleFilters(
      ["title", "description", "model", "month", "category"],
      Product.customFilters
    ),
    validateRequests,
  ],
  getProducts
);
router.get(
  "/:id",
  [
    verifyToken,
    check("id", "It is not a mongo id").isMongoId(),
    check("id").custom(theFieldExists("Product", "_id")),
    validateRequests,
  ],
  getProduct
);
router.post(
  "/",
  [
    verifyToken,
    check("title", "The title field is required").notEmpty(),
    check("model", "The model field is required").notEmpty(),
    check("title").custom(productExists),
    check("image").custom(
      validateFiles(["jpg", "png", "jpeg", "git"], "image")
    ),
    check("description", "The description field is required").notEmpty(),
    check("category", "It is not a mongo id").isMongoId(),
    check("category").custom(theFieldExists("Category", "_id")),
    check("images.*.url", "The URL field must be of type URL")
      .optional()
      .isURL(),
    check("price")
      .notEmpty()
      .withMessage("The price field is required")
      .isNumeric()
      .withMessage("The price must be a number"),
    validateRequests,
  ],
  createProduct
);
router.patch(
  "/:id",
  [
    verifyToken,
    check("id", "It is not a mongo id").isMongoId(),
    check("id").custom(theFieldExists("Product", "_id")),
    check("title").custom(productExists),
    check("category", "It is not a mongo id").optional().isMongoId(),
    check("category").optional().custom(theFieldExists("Category", "_id")),
    check("images.*.url", "The URL field must be of type URL")
      .optional()
      .isURL(),
    check("price")
      .optional()
      .isNumeric()
      .withMessage("The price must be a number"),
    validateRequests,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    verifyToken,
    hasRole("admin"),
    check("id", "It is not a mongo id").isMongoId(),
    check("id").custom(theFieldExists("Product", "_id")),
    validateRequests,
  ],
  deleteProduct
);

module.exports = router;
