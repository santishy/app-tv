const Product = require("../models/Product");
const { uploadFile, deleteUploadedFiles } = require("../helpers");

const getProductImages = async (req, res) => {
  const { id } = req.params;
  const { images } = await Product.findOne(
    { _id: id },
    {
      images: 1, //incluye el campo images, aun cuando es un array
      _id: 0, //excluye el _id de product
    }
  );

  return res.json({
    data: images.map((image) => ({
      id: image._id,
      type: "images",
      attributes: {
        url: image.url,
      },
    })),
  });
};

const addImageToProduct = async (req, res) => {
  const { id } = req.params;

  const results = await uploadFile(req.files.image, "products");

  const product = await Product.findByIdAndUpdate(
    id,
    {
      $push: { images: { $each: results } },
    },
    { new: true }
  );

  return res.json({
    data: product.images.map((image) => ({
      id: image._id,
      type: "images",
    })),
  });
};

const removeImageProduct = async (req, res) => {
  const { id: productId } = req.params;

  const { id: imageId } = req.body.data[0];

  const product = await Product.findOne(
    { _id: productId, "images._id": imageId },
    { "images.$": 1 }
  );

  if (!product) {
    return res.status(400).json({
      errors: [
        {
          message: "The product image does not exist",
        },
      ],
    });
  }
  try {
    await deleteUploadedFiles([product.images[0].url], "products");
    await Product.updateOne(
      {
        _id: productId,
      },
      {
        $pull: { images: { _id: imageId } },
      }
    );
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  addImageToProduct,
  removeImageProduct,
  getProductImages,
};
