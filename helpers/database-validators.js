const { request, response } = require("express");
const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");

const validateUniqueField = (modelName = '', field = '') => {
    return async (value, { req }) => {
        const model = mongoose.model(modelName);

        if (!model) {
            throw new Error(`The ${modelName} model does not exist`)
        }

        const query = { [field]: { $regex: new RegExp(`^${value}$`, 'i') } };

        if (req.params.id && (field != '_id')) {

            query._id = { $ne: req.params.id };
        }

        const exists = await model.findOne(query);
        console.log({ exists });
        if (exists) {
            throw new Error(`${field} already exists.`)
        }
        return true;
    };
}

const theFieldExists = (modelName, field) => {
    return async (value, { req }) => {

        const model = mongoose.model(modelName);

        if (!model) {
            throw new Error(`The ${modelName} model does not exist`)
        }
        const query = { [field]: value };

        if (req.params.id && (field != '_id')) {
            query._id = { $ne: req.params.id };
        }

        const exists = await model.findOne(query);

        if (!exists) {
            throw new Error(`The ${field} field does not exist.`)
        }

        return true;
    }
}

const productExists = async (title, { req }) => {

    let model = req.body.model;

    const { id } = req.params;

    if (!model && id) {
        const product = await Product.findById(id);
        model = product.model;
    }

    const query = {
        title: { $regex: new RegExp(`^${title}$`, 'i') },
        model: { $regex: new RegExp(`^${model}$`, 'i') }
    };

    if (req.params.id) {
        query._id = { $ne: req.params.id };
    }
    const product = await Product.findOne(query);

    if (product) {
        throw new Error(`A product with the title: ${title} and model: ${model} already exists.`);
    }

    return true;
}

module.exports = {
    validateUniqueField,
    theFieldExists,
    productExists
}