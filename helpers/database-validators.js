const { default: mongoose } = require("mongoose")

const validateUniqueField = (value) => {
    return async (modelName, field) => {
        const model = mongoose.model(modelName);
        const exists = await model.findOne({ [field]: value });
        if (exists) {
            throw new Error(`${field} already exists.`)
        }
        return true;
    };
}

module.exports = {
    validateUniqueField
}