const { capitalizeFirstLetter } = require("../../helpers/str");

const allowedModels = [
    'User',
    'Category',
    'Product',
];


const search = async (req, res) => {
    const { model, term } = req.params;

    const capitalizedModel = capitalizeFirstLetter(model);

}


module.exports = {
    search
}