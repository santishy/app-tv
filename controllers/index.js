const categoryController = require('./category.controller');
const productController = require('./product.controller');
const userController = require('./product.controller');
const productImage = require('./product-image.controller');

module.exports = {
  ...categoryController,
  ...productController,
  ...userController,
  ...productImage,
};
