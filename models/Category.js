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
}, { timestamps: true });

categorySchema.methods.toJSON = function () {
    const { __v, status, ...rest } = this.toObject();
    return rest;
}

module.exports = model('Category', categorySchema);