const { default: mongoose } = require("mongoose")

const validateUniqueField = (modelName = '', field = '') => {
    return async (value, { req }) => {
        const model = mongoose.model(modelName);

        if (!model) {
            throw new Error(`The ${modelName} model does not exist`)
        }

        const query = { [field]: { $regex: new RegExp(`^${value}$`, 'i') } };

        if (req.params.id && (field != '_id')) {

            query._id = { $ne: req.params.id };
        }

        const exists = await model.findOne(query);
        console.log({ exists });
        if (exists) {
            throw new Error(`${field} already exists.`)
        }
        return true;
    };
}

const theFieldExists = (modelName, field) => {
    return async (value, { req }) => {

        const model = mongoose.model(modelName);

        if (!model) {
            throw new Error(`The ${modelName} model does not exist`)
        }
        const query = { [field]: value };

        if (req.params.id && (field != '_id')) {
            query._id = { $ne: req.params.id };
        }

        const exists = await model.findOne(query);

        if (!exists) {
            throw new Error(`The ${field} field does not exist.`)
        }
        return true;
    }
}
module.exports = {
    validateUniqueField,
    theFieldExists
}