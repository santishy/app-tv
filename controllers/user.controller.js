const { response, request } = require('express');
const bcryptjs = require('bcryptjs')
const User = require('../models/User');

const getUsers = async (req, res = response) => {

    const { page, limit = 5 } = req.query;

    const query = { status: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(page)
            .limit(limit)
    ]);
    res.json({
        data:
            users,
        meta: {
            total,
            per_page: limit,
            page
        }
    })
}

const getUser = () => {
    const user = new User()
}

const updateUser = async (req = request, res = response) => {
    const { id } = req.params;
    const { password, _id, role, ...rest } = req.body;
    let user = null;
    try {
        if (password) {
            const salt = bcryptjs.genSaltSync();
            rest.password = bcryptjs.hashSync(password, salt)
        }
        if (role && req.user.hasRole('admin')) {
            rest.role = role;
        }
        user = await User.findByIdAndUpdate(id, rest, { new: true });
    } catch (error) {
        console.log(error);
        return res.json({
            errors: [
                {
                    "message": "Error updating user"
                }
            ]
        });
    }
    return res.json({ user })
}

const createUser = async (req = request, res = response) => {

    const { password, ...rest } = req.body;

    const user = new User({ password, ...rest });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();
    return res.json({ user })
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { status: false });
    return res.status(204).json()
}


module.exports = {
    getUsers,
    getUser,
    updateUser,
    createUser,
    deleteUser
}