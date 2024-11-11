const { request, response } = require('express');
const bcryptjs = require('bcryptjs')
const User = require('../../models/User');

const login = async (req = request, res = response) => {
    const { username, password } = req.body;
    const user = await User.find({ username });
    if (!user.status) {
        throw new Error(`The user ${username} is deactivated`);
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
        throw new Error('Credentials are incorrect. Password/Username')
    }
}





module.exports = login;