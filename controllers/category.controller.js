const { request, response } = require('express');
const { Category } = require("../models")

const createCategory = async (req = request, res = response) => {
    const { name } = req.body;

    const category = new Category({ name: name.toUpperCase() });
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

const getCategories = async (req, res) => {

    const { page = 0, limit = 25 } = req.query;
    console.log({ page, limit })
    const categories = await Category.find({ status: true })
        .skip(Number(page))
        .limit(Number(limit));
    // const [total, categories] = await Promise.all([
    //     Category.countDocuments(),
    //     Category.find({ status: true })
    //         .skip(Number(page))
    //         .limit(Number(limit)),
    // ]);

    return res.json({
        data:
            categories
        ,
        // meta: {
        //     total,
        //     per_page: limit,
        //     page
        // }
    });
}

const updateCategory = async (req, res) => {
    const { id } = req.params;

    const { name = '' } = req.body;

    const category = await Category.findByIdAndUpdate(
        id, { name: name.toUpperCase() }, { new: true }
    );

    return res.json({
        category
    })
}

const deleteCategory = async (req = request, res = response) => {
    const { id } = req.params;

    await Category.findByIdAndUpdate(
        id, { status: false }, { new: true }
    );

    return res.status(204).json();
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}