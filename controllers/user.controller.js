const { response, request } = require('express');
const bcryptjs = require('bcryptjs')
const User = require('../models/User');
const { validationResult } = require('express-validator');
const getUsers = (req, res = response) => {
    const { page } = req.query;
    res.json({ status: 'ok', page })
}

const getUser = () => {
    const user = new User()
}

const updateUser = (req = request, res = response) => {
    const { id } = req.params;
    res.json({
        id,
        msg: 'patch'
    })
}

const createUser = async (req = request, res = response) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json(errors);
    }

    const { password, name, username, email } = req.body;

    const user = new User({ password, name, username, email });
    
    const emailExists =await User.findOne({email});

    if(emailExists){
        return res.status(422).json({
            errors:[
                {message:'The email already exists'}
            ]
        })
    }
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