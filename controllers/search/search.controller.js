const { isValidObjectId } = require("mongoose");
const { capitalizeFirstLetter } = require("../../helpers/str");

const allowedModels = ["User", "Category", "Product"];

const findById = async (params, res) => {
  const { model, term } = params;
  try {
    const Model = mongoose.model(model);

    const data = await Model.findById(term);

    res.json({
      results: data || [],
    });
  } catch (error) {
    res.status(500).json({
      errors: [
        {
          message: "Model and term parameters are required",
          details: error.message,
        },
      ],
    });
  }
};

const find = (params, res) => {
  const { model, term } = params;
  res.json({ model, term });
};

const search = async (req, res) => {
  const { model, term } = req.params;

  const capitalizedModel = capitalizeFirstLetter(model);

  if (!allowedModels.includes(capitalizedModel)) {
    return res.status(400).json({
      errors: [
        {
          message: "The model does not exist",
        },
      ],
    });
  }

  isValidObjectId({ capitalizedModel, term })
    ? findById({ capitalizedModel, term }, res)
    : find({ capitalizedModel, term }, res);
};

module.exports = {
  search,
};
