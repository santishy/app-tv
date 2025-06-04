const { Router } = require("express");
const { check } = require("express-validator");
const {
  addImageToProduct,
  removeImageProduct,
  getProductImages,
} = require("../controllers");
const { verifyToken, validateRequests } = require("../middlewares");
const {
  theFieldExists,
  validateFiles,
  validateDimensionsImage,
} = require("../helpers");

const router = Router({ mergeParams: true });

router.post(
  "/relationships/images",
  [
    verifyToken,
    check("id", "It is not a mongo id").isMongoId(),
    check("id").custom(theFieldExists("Product", "_id")),
    check("image").custom(
      validateFiles(["jpg", "png", "jpeg", "git"], "image")
    ),
    check("image").custom(validateDimensionsImage(1980, 1080)),
    validateRequests,
  ],
  addImageToProduct
);

router.patch(
  "/relationships/images",
  [
    verifyToken,
    check("id", "It is not mongo id").isMongoId(),
    check("id").custom(theFieldExists("Product", "_id")),
    check("data", "The data field must be an array").isArray(),
    check("data.*.id", "It is not mongo id").isMongoId(),
    validateRequests,
  ],
  removeImageProduct
);

router.get(
  "/images",
  [
    verifyToken,
    check("id", "It is not mongo id").isMongoId(),
    check("id").custom(theFieldExists("Product", "_id")),
    validateRequests,
  ],
  getProductImages
);

module.exports = router;
