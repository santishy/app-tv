const { default: mongoose } = require("mongoose")

const validateUniqueField = (modelName, field) => {
    return async (value) => {
        const model = mongoose.model(modelName);
        const exists = await model.findOne({ [field]: value });
        if (exists) {
            throw new Error(`${field} already exists.`)
        }
        return true;
    };
}

const theFieldExists = (modelName, field) => {
    return async (value) => {
        const model = mongoose.model(modelName);
        if (!model) {
            throw new Error(`The ${modelName} model does not exist`)
        }
        const exists = await model.findOne({ [field]: value });
        if (!exists) {
            throw new Error('')
        }
    }
}
module.exports = {
    validateUniqueField
}