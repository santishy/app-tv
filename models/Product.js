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
      new Schema(
        {
          url: { type: String },
        },
        { id: false } // ❌ Evita que Mongoose agregue "_id" e "id" en cada imagen
      ),
      /*  {
        url: {
          type: String,
        },
      }, */
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
  {
    timestamps: true,
    // toJSON: { virtuals: true, id: false },
    toObject: { virtuals: true, id: false },
  }
);

productSchema.methods.toJSON = function () {
  const { __v, _id, id, status, ...rest } = this.toObject({ virtuals: true });
  rest.uuid = _id;
  return rest;
};
productSchema.methods.hasRole = function (role) {
  return this.role === role;
};

productSchema.statics.customFilters = {
  search: (value) => {
    const regEx = new RegExp(value, "i");
    return {
      $or: [
        {
          title: regEx,
        },
        {
          description: regEx,
        },
      ],
    };
  },
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

productSchema.virtual("fullImages").get(function () {
  const baseUrl = process.env.BASE_URL;

  return this.images.map((image) => ({
    _id: image._id,
    url: `${baseUrl}/images/products/${image.url}`,
  }));
});
module.exports = model("Product", productSchema);
