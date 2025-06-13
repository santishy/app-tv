const { Router } = require("express");
const { check } = require("express-validator");
const {
  addImageToProduct,
  removeImageProduct,
  getProductImages,
} = require("../controllers");
const { verifyToken, validateRequests } = require("../middlewares");
const { theFieldExists } = require("../helpers");
const { validateFiles } = require("../middlewares/validate-files");
const {
  validateDimensionsImage,
} = require("../middlewares/validate-image-dimensions");

const router = Router({ mergeParams: true });

router.post(
  "/relationships/images",
  [
    verifyToken,
    check("id", "It is not a mongo id").isMongoId(),
    check("id").custom(theFieldExists("Product", "_id")),
    validateFiles(["jpg", "png", "jpeg", "git", "webp"], "images"),
    validateDimensionsImage("images", { width: 800, height: 800 }),
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
