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
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'guest'],
        default: 'user'
    },
}, { timestamps: true });

userSchema.methods.toJSON = function () {
    const { __v, _id, password, ...rest } = this.toObject();
    rest.uuid = _id;
    return rest;
}
userSchema.methods.hasRole = function (role) {
    return this.role === role;
}
module.exports = model('User', userSchema);