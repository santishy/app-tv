const jwt = require('jsonwebtoken')
const User = require('../models/User');

const verifyToken = async (req, res, next) => {

    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json(getAuthenticationError('Invalid token'))
    }

    try {

        const { uuid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);

        const user = await User.findById(uuid);

        if (!user) {
            return res.status(401).json(getAuthenticationError('The user does not exist'))
        }

        if (!user.status) {
            return res.status(401).json(getAuthenticationError('Unauthenticated user'));
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json(getAuthenticationError('Unauthenticated user'))
    }

}

const getAuthenticationError = (message) => {
    return {
        errors: [
            {
                message,
            }
        ]
    }
}

module.exports = {
    verifyToken
}