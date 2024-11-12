const { request, response } = require('express');
const bcryptjs = require('bcryptjs')
const User = require('../../models/User');
const { generateToken } = require('../../helpers/jwt');

const login = async (req = request, res = response) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user.status) {
        throw new Error(`The user ${username} is deactivated`);
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
        throw new Error('Credentials are incorrect. Password/Username')
    }

    const token = await generateToken(user.id);

    return res.json({
        user,
        token
    });
}





module.exports = login;