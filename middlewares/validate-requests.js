
const { validationResult } = require('express-validator');
const validateRequests = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(errors);
    }
    next();
}

module.exports = {
    validateRequests
}