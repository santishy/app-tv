const { model, Schema } = require('mongoose');
const campaignProductSchema = Schema(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    offerPrice: {
      type: Number,
      required: false,
    },
    promoLabel: {
      type: String,
      required: false,
    },
    promoDescription: {
      type: String,
      required: false,
    },
    sortOrder: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true, id: false },
  },
);

campaignProductSchema.index({ campaign: 1, product: 1 }, { unique: true });
// aqui abajo, se asegura que no haya dos productos con el mismo orden dentro de la misma campaña
campaignProductSchema.index({ campaign: 1, sortOrder: 1 }, { unique: true });

campaignProductSchema.methods.toJSON = function () {
  const { __v, _id, id, ...rest } = this.toObject({ virtuals: true });
  rest.uuid = _id;
  return rest;
};

module.exports = model('CampaignProduct', campaignProductSchema);
