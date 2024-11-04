const { response, request } = require('express')

const getProducts = (req, res = response) => {
    const { page } = req.query;
    res.json({ status: 'ok', page })
}

const getProduct = () => {

}

const updateProduct = (req = request, res = response) => {
    const { id } = req.params;
    res.json({
        id,
        msg: 'patch'
    })
}

const createProduct = (req = request, res = response) => {
    const body = req.body;

    res.json({ body })
}

const deleteProduct = () => { }


module.exports = {
    getProducts,
    getProduct,
    updateProduct,
    createProduct,
    deleteProduct
}