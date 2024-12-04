const { model, Schema } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const dayjs = require("dayjs");
const productSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
        },
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    model: {
      type: String,
      default: "Genérico",
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const { __v, _id, status, ...rest } = this.toObject();
  rest.uuid = _id;
  return rest;
};
productSchema.methods.hasRole = function (role) {
  return this.role === role;
};

productSchema.statics.customFilters = {
  month: (value) => {
    const start = new Date(new Date().getFullYear(), value - 1, 1);
    const end = new Date(new Date().getFullYear(), value, 0);

    return {
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };
  },
  category: (categoryId) => {
    if (!ObjectId.isValid(categoryId)) {
      throw new Error(`The ${categoryId} is not valid.`);
    }
    return { category: new ObjectId(categoryId) };
  },
};
module.exports = model("Product", productSchema);
