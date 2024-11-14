const { model, Schema } = require('mongoose');

const categorySchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: Boolean,
        default: true
    },
});

userSchema.methods.toJSON = function () {
    const { __v, _id, ...rest } = this.toObject();
    rest.uuid = _id;
    return rest;
}

module.exports = model('Category', categorySchema);