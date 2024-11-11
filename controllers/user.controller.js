const { response, request } = require('express');
const bcryptjs = require('bcryptjs')
const User = require('../models/User');

const getUsers = (req, res = response) => {
    const { page } = req.query;
    res.json({ status: 'ok', page })
}

const getUser = () => {
    const user = new User()
}

const updateUser = async (req = request, res = response) => {
    const { id } = req.params;
    const { password, _id, ...rest } = req.body;
    let user = null;
    try {

        if (password) {
            const salt = bcryptjs.genSaltSync();
            rest.password = bcryptjs.hashSync(password, salt)
        }
        user = await User.findByIdAndUpdate(id, rest);
    } catch (error) {
        console.log(error);
        throw new Error('Error updating user')
    }
    return res.json({ user })
}

const createUser = async (req = request, res = response) => {

    const { password, name, username, email } = req.body;

    const user = new User({ password, name, username, email });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt)
    await user.save();
    return res.json({ user })
}

const deleteUser = () => { }


module.exports = {
    getUsers,
    getUser,
    updateUser,
    createUser,
    deleteUser
}