const { request, response } = require('express');
const { Category } = require("../models")

const createCategory = async (req = request, res = response) => {
    const { name } = req.body;

    const category = new Category({ name });
    await category.save();

    return res.status(201).json({ category })
}

const getCategory = async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id)
    return res.json({
        category
    });
}