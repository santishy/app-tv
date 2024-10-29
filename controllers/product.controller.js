const {Response} = require('express')

const getProducts = (req,res = Response) => {
    res.json({status:'ok'})
}

const getProduct = () => {

}

const updateProduct = () => {

}

const createProduct = () => {

}

const deleteProduct = () => {} 


module.exports = {
    getProducts,
    getProduct,
    updateProduct,
    createProduct,
    deleteProduct
}