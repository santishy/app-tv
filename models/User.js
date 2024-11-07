const { model, Schema } = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function () {
    const { __v, _id, ...rest } = this.toObject();
    return rest;
}

module.exports = model('User', userSchema);