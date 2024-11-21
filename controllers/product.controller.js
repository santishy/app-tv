const { response, request } = require('express');
const Product = require('../models/Product');

const getProducts = async (req, res = response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;
    const [total, products] = await Promise.all([
        Product.countDocuments(),
        Product.find({ status: true })
            .skip((page - 1) * limit)
            .limit(limit),
    ]);

    return res.json({
        data:
            products
        ,
        meta: {
            total,
            per_page: limit,
            page
        }
    });
}

const getProduct = async (req = request, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate({ path: 'category', select: 'name' });

    return res.json(product)
}

const updateProduct = (req = request, res = response) => {
    const { id } = req.params;
    res.json({
        id,
        msg: 'patch'
    })
}

const createProduct = async (req = request, res = response) => {

    const { title = '', description, price, model, categoryId } = req.body;

    const product = new Product({
        title: title.toUpperCase(),
        description,
        price,
        model: model.toUpperCase(),
        category: categoryId
    });

    await product.save();

    const populatedProduct = await product.populate('category', 'name');

    res.status(201).json(
        { product: populatedProduct }
    );
}

const deleteProduct = () => { }


module.exports = {
    getProducts,
    getProduct,
    updateProduct,
    createProduct,
    deleteProduct
}