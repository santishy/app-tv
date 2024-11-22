const { model, Schema } = require('mongoose');

const productSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    images: [{
        url: {
            type: String,
        }
    }],
    status: {
        type: Boolean,
        default: true
    },
    model: {
        type: String,
        default: 'Genérico'
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
}, { timestamps: true });

productSchema.methods.toJSON = function () {
    const { __v, _id, status, ...rest } = this.toObject();
    rest.uuid = _id;
    return rest;
}
productSchema.methods.hasRole = function (role) {
    return this.role === role;
}
module.exports = model('Product', productSchema);