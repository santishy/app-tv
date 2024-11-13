const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                errors: [
                    {
                        message: 'The user does not exist'
                    }
                ]
            })
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                errors: [
                    {
                        message: `The unauthorized ${user.name} user`
                    }
                ]
            })
        }
        next();
    }
}

module.exports = {
    hasRole
}