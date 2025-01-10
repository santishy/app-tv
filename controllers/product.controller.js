const { response, request } = require("express");
const Product = require("../models/Product");
const { uploadFile, deleteUploadedFiles } = require("../helpers/upload");

const getProducts = async (req, res = response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;

  const query = { status: true, ...req.filters };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .skip((page - 1) * limit) // Saltar los documentos anteriores a la página actual
      .limit(limit),
  ]);

  return res.json({
    data: products,
    meta: {
      total,
      per_page: limit,
      page,
    },
  });
};

const getProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate({
    path: "category",
    select: "name",
  });

  return res.json(product);
};

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, uuid, ...rest } = req.body;

  if (rest.title) {
    rest.title = rest.title.toUpperCase();
  }
  if (rest.model) {
    rest.model = rest.model.toUpperCase();
  }

  const product = await Product.findByIdAndUpdate(id, rest, { new: true });

  res.json(product);
};

const createProduct = async (req = request, res = response) => {
  const { title, description, price, model, category } = req.body;

  const product = new Product({
    title: title.toUpperCase(),
    description,
    price,
    model: model.toUpperCase(),
    category,
  });

  if (req.files.image) {
    const results = await uploadFile(req.files.image, "products");
    console.log(results);
    product.images = results;
  }

  await product.save();

  const populatedProduct = await product.populate("category", "name");

  res.status(201).json({ product: populatedProduct });
};

const deleteProduct = async (req, res) => {
  const { id } = req.body;
  const product = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  return res.status(204).json();
};

module.exports = {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
};
